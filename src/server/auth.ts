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
        // Seed admin — set role directly, no invite code
        await db.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
        return;
      }

      // Consume the invite code
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const code = cookieStore.get("invite_code")?.value;

      if (!code) return;

      // Atomically claim the invite code (prevent race conditions)
      const invite = await db.inviteCode.updateMany({
        where: { code, usedById: null, revoked: false },
        data: { usedById: user.id, usedAt: new Date() },
      });

      if (invite.count > 0) {
        const inviteCode = await db.inviteCode.findUnique({ where: { code } });
        if (inviteCode) {
          await db.user.update({
            where: { id: user.id },
            data: { role: inviteCode.role },
          });
        }
      }

      // Clear the invite code cookie
      cookieStore.delete("invite_code");
    },
  },
});
