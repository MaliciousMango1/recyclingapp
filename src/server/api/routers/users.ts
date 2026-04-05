import { z } from "zod";
import { randomBytes } from "crypto";
import { createTRPCRouter } from "~/server/api/trpc";
import { protectedProcedure, adminProcedure } from "~/server/api/admin-auth";

export const usersRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { id: true, name: true, email: true, role: true, image: true },
    });
    return user;
  }),

  listUsers: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        inviteCodeUsed: {
          select: { code: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["ADMIN", "EDITOR"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) {
        throw new Error("Cannot change your own role");
      }
      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  removeUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) {
        throw new Error("Cannot remove yourself");
      }
      return ctx.db.user.delete({ where: { id: input.userId } });
    }),

  createInviteCode: adminProcedure
    .input(
      z.object({
        role: z.enum(["ADMIN", "EDITOR"]),
        expiresInHours: z.number().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const code = randomBytes(4).toString("hex").toUpperCase();
      const expiresAt = input.expiresInHours
        ? new Date(Date.now() + input.expiresInHours * 60 * 60 * 1000)
        : null;

      return ctx.db.inviteCode.create({
        data: {
          code,
          role: input.role,
          createdById: ctx.session.user.id,
          expiresAt,
        },
      });
    }),

  listInviteCodes: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.inviteCode.findMany({
      include: {
        createdBy: { select: { name: true, email: true } },
        usedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  revokeInviteCode: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.inviteCode.update({
        where: { id: input.id },
        data: { revoked: true },
      });
    }),
});
