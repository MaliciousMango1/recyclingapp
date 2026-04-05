import { TRPCError } from "@trpc/server";
import { timingSafeEqual } from "crypto";
import { publicProcedure } from "~/server/api/trpc";

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Simple admin auth - checks for ADMIN_PASSWORD env var
// In production, swap this for proper auth (NextAuth, SSO, etc.)
export const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const authHeader = ctx.headers.get("x-admin-token");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "ADMIN_PASSWORD not configured",
    });
  }

  if (!authHeader || !safeCompare(authHeader, adminPassword)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid admin credentials",
    });
  }

  return next({ ctx });
});
