import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/server/db";
import type { Role } from "@prisma/client";

const SEED_ADMIN_EMAIL = "zduclos@gmail.com";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers: [Google],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      // Existing users can always sign in
      const existing = await db.user.findUnique({
        where: { email: user.email! },
      });
      if (existing) return true;

      // Seed admin gets in without an invite code
      if (user.email === SEED_ADMIN_EMAIL) return true;

      // New users need a valid invite code (stored in cookie before OAuth)
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const code = cookieStore.get("invite_code")?.value;

      if (!code) {
        return "/auth/signin?error=InviteRequired";
      }

      const invite = await db.inviteCode.findUnique({ where: { code } });

      if (
        !invite ||
        invite.revoked ||
        invite.usedById ||
        (invite.expiresAt && invite.expiresAt < new Date())
      ) {
        return "/auth/signin?error=InvalidInvite";
      }

      return true;
    },

    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = (user as { role: Role }).role;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email === SEED_ADMIN_EMAIL) {
        await db.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
        return;
      }

      // Consume the invite code and assign the role in a single transaction
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const code = cookieStore.get("invite_code")?.value;

      if (!code) return;

      await db.$transaction(async (tx) => {
        const invite = await tx.inviteCode.findUnique({ where: { code } });
        if (!invite || invite.revoked || invite.usedById) return;

        await tx.inviteCode.update({
          where: { id: invite.id },
          data: { usedById: user.id, usedAt: new Date() },
        });

        await tx.user.update({
          where: { id: user.id },
          data: { role: invite.role },
        });
      });
    },
  },
});
