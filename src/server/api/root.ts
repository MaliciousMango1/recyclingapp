import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { itemsRouter } from "~/server/api/routers/items";
import { adminRouter } from "~/server/api/routers/admin";

export const appRouter = createTRPCRouter({
  items: itemsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
