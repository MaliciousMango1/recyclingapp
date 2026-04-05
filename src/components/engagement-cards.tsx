"use client";

import { api } from "~/lib/trpc";
import { getCategoryConfig } from "~/lib/categories";

export function EngagementCards() {
  const stats = api.items.getEngagementStats.useQuery();

  if (stats.isLoading) {
    return (
      <div className="mt-12 w-full max-w-md mx-auto">
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-40 mx-auto mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats.data || stats.data.topSearches.length === 0) return null;

  const { topSearches } = stats.data;

  return (
    <div className="mt-12 w-full max-w-md mx-auto">
      <h3 className="text-sm font-medium text-gray-400 text-center mb-3">
        🔥 Trending this month
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {topSearches.map((item: any) => {
          const config = getCategoryConfig(item.category);
          return (
            <span
              key={item.slug}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                         ${config.bgColor} ${config.color} border ${config.borderColor}`}
            >
              {config.emoji} {item.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
