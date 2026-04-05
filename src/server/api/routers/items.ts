import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getAIDisposalAdvice } from "~/server/api/ai-fallback";
import { isRateLimited } from "~/server/api/rate-limit";
import Fuse from "fuse.js";

export const itemsRouter = createTRPCRouter({
  // Search for an item by query string
  search: publicProcedure
    .input(z.object({ query: z.string().min(1).max(200) }))
    .mutation(async ({ ctx, input }) => {
      const query = input.query.trim().toLowerCase();

      // Step 1: Try exact name match
      const exactMatch = await ctx.db.item.findFirst({
        where: {
          OR: [
            { name: { equals: query, mode: "insensitive" } },
            { slug: { equals: query.replace(/\s+/g, "-"), mode: "insensitive" } },
            { aliases: { has: query } },
          ],
        },
        include: { material: true },
      });

      if (exactMatch) {
        await ctx.db.searchLog.create({
          data: { query, matched: true, aiFallback: false, resultItemId: exactMatch.id },
        });
        return {
          source: "database" as const,
          isVerified: exactMatch.isVerified,
          item: exactMatch,
        };
      }

      // Step 2: Fuzzy search across all items
      const allItems = await ctx.db.item.findMany({
        include: { material: true },
      });

      const fuse = new Fuse(allItems, {
        keys: [
          { name: "name", weight: 2 },
          { name: "aliases", weight: 1.5 },
          { name: "instructions", weight: 0.5 },
        ],
        threshold: 0.4,
        includeScore: true,
      });

      const fuzzyResults = fuse.search(query);

      if (fuzzyResults.length > 0 && fuzzyResults[0]!.score! < 0.3) {
        const bestMatch = fuzzyResults[0]!.item;
        await ctx.db.searchLog.create({
          data: { query, matched: true, aiFallback: false, resultItemId: bestMatch.id },
        });
        return {
          source: "fuzzy" as const,
          isVerified: bestMatch.isVerified,
          item: bestMatch,
          suggestions: fuzzyResults.slice(1, 4).map((r) => ({
            name: r.item.name,
            slug: r.item.slug,
            category: r.item.category,
          })),
        };
      }

      // Step 3: AI fallback (rate limited to control API costs)
      let aiResult = null;
      if (!isRateLimited("ai-fallback", 30, 60_000)) {
        aiResult = await getAIDisposalAdvice(query);
      }

      await ctx.db.searchLog.create({
        data: { query, matched: false, aiFallback: !!aiResult },
      });

      if (aiResult) {
        return {
          source: "ai" as const,
          isVerified: false,
          item: {
            name: query,
            slug: query.replace(/\s+/g, "-"),
            category: aiResult.category,
            instructions: aiResult.instructions,
            tips: aiResult.tips,
            material: null,
          },
          confidence: aiResult.confidence,
          suggestions: fuzzyResults.slice(0, 3).map((r) => ({
            name: r.item.name,
            slug: r.item.slug,
            category: r.item.category,
          })),
        };
      }

      // Step 4: Nothing found at all
      return {
        source: "none" as const,
        isVerified: false,
        item: null,
        suggestions: fuzzyResults.slice(0, 5).map((r) => ({
          name: r.item.name,
          slug: r.item.slug,
          category: r.item.category,
        })),
      };
    }),

  // Get a single item by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.item.findUnique({
        where: { slug: input.slug },
        include: { material: true },
      });
    }),

  // Browse all items by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.item.findMany({
        where: input.category
          ? { category: input.category as any }
          : undefined,
        include: { material: true },
        orderBy: { name: "asc" },
      });
    }),

  // Get all materials for the browse page
  getMaterials: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.material.findMany({
      include: {
        items: {
          orderBy: { name: "asc" },
        },
        _count: { select: { items: true } },
      },
      orderBy: { name: "asc" },
    });
  }),

  // Submit an issue report (public, no auth required)
  reportIssue: publicProcedure
    .input(
      z.object({
        itemSlug: z.string().nullable(),
        itemName: z.string().min(1).max(200),
        reportType: z.enum(["incorrect", "outdated", "missing", "other"]),
        description: z.string().min(5).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limit: 10 reports per hour globally
      if (isRateLimited("report-issue", 10, 3600_000)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message:
            "Too many reports submitted recently. Please try again later or email hello@recycleathens.com.",
        });
      }

      return ctx.db.issueReport.create({
        data: input,
      });
    }),

  // Get public site settings
  getSiteSettings: publicProcedure.query(async ({ ctx }) => {
    const showVerifiedDates = await ctx.db.siteSetting.findUnique({
      where: { key: "showVerifiedDates" },
    });

    return {
      showVerifiedDates: showVerifiedDates?.value !== "false",
    };
  }),
});
