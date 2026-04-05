import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { protectedProcedure } from "~/server/api/admin-auth";

const disposalCategoryEnum = z.enum([
  "RECYCLE",
  "COMPOST",
  "LANDFILL",
  "HAZARDOUS",
  "SPECIAL_DROPOFF",
  "REUSE",
]);

const itemCreateInput = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  aliases: z.array(z.string()).default([]),
  category: disposalCategoryEnum,
  instructions: z.string().min(1),
  tips: z.string().nullable().default(null),
  materialId: z.string().nullable().default(null),
  sourceUrl: z.string().url().nullable().default(null),
  isVerified: z.boolean().default(true),
  lastVerifiedAt: z.string().datetime().nullable().default(null),
});

const itemUpdateInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  aliases: z.array(z.string()).optional(),
  category: disposalCategoryEnum.optional(),
  instructions: z.string().min(1).optional(),
  tips: z.string().nullable().optional(),
  materialId: z.string().nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  isVerified: z.boolean().optional(),
  lastVerifiedAt: z.string().datetime().nullable().optional(),
});

export const adminRouter = createTRPCRouter({
  // ── Item CRUD ──────────────────────────────────────────

  createItem: protectedProcedure
    .input(itemCreateInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.item.create({ data: input });
    }),

  updateItem: protectedProcedure
    .input(itemUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.item.update({
        where: { id },
        data,
      });
    }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.item.delete({ where: { id: input.id } });
    }),

  listItems: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        category: disposalCategoryEnum.optional(),
        verified: z.boolean().optional(),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(25),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { aliases: { has: input.search.toLowerCase() } },
        ];
      }
      if (input.category) where.category = input.category;
      if (input.verified !== undefined) where.isVerified = input.verified;

      const [items, total] = await Promise.all([
        ctx.db.item.findMany({
          where,
          include: { material: true },
          orderBy: { updatedAt: "desc" },
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
        }),
        ctx.db.item.count({ where }),
      ]);

      return {
        items,
        total,
        pages: Math.ceil(total / input.perPage),
        page: input.page,
      };
    }),

  // ── Review Queue ───────────────────────────────────────

  getReviewQueue: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get unmatched searches grouped by query with count
      const logs = await ctx.db.searchLog.groupBy({
        by: ["query"],
        where: { matched: false, aiFallback: true },
        _count: { query: true },
        orderBy: { _count: { query: "desc" } },
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
      });

      const total = await ctx.db.searchLog.groupBy({
        by: ["query"],
        where: { matched: false, aiFallback: true },
      });

      return {
        queries: logs.map((l) => ({
          query: l.query,
          searchCount: l._count.query,
        })),
        total: total.length,
        pages: Math.ceil(total.length / input.perPage),
        page: input.page,
      };
    }),

  // Promote an AI-generated search into a verified item
  promoteFromQueue: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        item: itemCreateInput,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create the verified item
      const created = await ctx.db.item.create({
        data: {
          ...input.item,
          isVerified: true,
        },
      });

      // Mark those search logs as matched
      await ctx.db.searchLog.updateMany({
        where: { query: input.query, matched: false },
        data: { matched: true, resultItemId: created.id },
      });

      return created;
    }),

  // Dismiss a queue entry (mark as reviewed but don't create item)
  dismissFromQueue: protectedProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.searchLog.deleteMany({
        where: { query: input.query, matched: false, aiFallback: true },
      });
      return { dismissed: true };
    }),

  // ── Materials ──────────────────────────────────────────

  listMaterials: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.material.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { name: "asc" },
    });
  }),

  createMaterial: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullable().default(null),
        iconName: z.string().nullable().default(null),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.material.create({ data: input });
    }),

  // ── Stats ──────────────────────────────────────────────

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalItems, verifiedItems, totalSearches, unmatchedSearches, aiFallbacks, openReports] =
      await Promise.all([
        ctx.db.item.count(),
        ctx.db.item.count({ where: { isVerified: true } }),
        ctx.db.searchLog.count(),
        ctx.db.searchLog.count({ where: { matched: false } }),
        ctx.db.searchLog.count({ where: { aiFallback: true } }),
        ctx.db.issueReport.count({ where: { resolved: false } }),
      ]);

    // Top searches last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const topSearches = await ctx.db.searchLog.groupBy({
      by: ["query"],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { query: true },
      orderBy: { _count: { query: "desc" } },
      take: 10,
    });

    return {
      totalItems,
      verifiedItems,
      totalSearches,
      unmatchedSearches,
      aiFallbacks,
      openReports,
      matchRate: totalSearches > 0
        ? Math.round(((totalSearches - unmatchedSearches) / totalSearches) * 100)
        : 0,
      topSearches: topSearches.map((s) => ({
        query: s.query,
        count: s._count.query,
      })),
    };
  }),

  // ── Issue Reports ──────────────────────────────────────

  getReports: protectedProcedure
    .input(
      z.object({
        resolved: z.boolean().default(false),
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = { resolved: input.resolved };

      const [reports, total] = await Promise.all([
        ctx.db.issueReport.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
        }),
        ctx.db.issueReport.count({ where }),
      ]);

      return {
        reports,
        total,
        pages: Math.ceil(total / input.perPage),
        page: input.page,
      };
    }),

  resolveReport: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.issueReport.update({
        where: { id: input.id },
        data: { resolved: true, resolvedAt: new Date() },
      });
    }),

  deleteReport: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.issueReport.delete({ where: { id: input.id } });
    }),

  // ── Site Settings ──────────────────────────────────────

  getSiteSettings: protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return {
      showVerifiedDates: map["showVerifiedDates"] !== "false",
    };
  }),

  updateSiteSetting: protectedProcedure
    .input(
      z.object({
        key: z.enum(["showVerifiedDates"]),
        value: z.string().max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.siteSetting.upsert({
        where: { key: input.key },
        update: { value: input.value },
        create: { key: input.key, value: input.value },
      });
    }),
});
