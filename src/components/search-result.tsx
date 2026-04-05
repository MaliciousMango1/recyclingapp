"use client";

import { getCategoryConfig } from "~/lib/categories";
import { ReportIssueButton } from "~/components/report-issue-button";

interface SearchResultProps {
  result: {
    source: "database" | "fuzzy" | "ai" | "none";
    isVerified: boolean;
    item: {
      name: string;
      slug: string;
      category: string;
      instructions: string;
      tips?: string | null;
      lastVerifiedAt?: string | Date | null;
      material?: { name: string } | null;
    } | null;
    confidence?: "high" | "medium" | "low";
    suggestions?: { name: string; slug: string; category: string }[];
  };
  query: string;
  showVerifiedDates?: boolean;
}

function formatVerifiedDate(date: string | Date | null | undefined): string | null {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysSinceVerified(date: string | Date | null | undefined): number | null {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function SearchResult({ result, query, showVerifiedDates = true }: SearchResultProps) {
  if (result.source === "none" || !result.item) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">
          We couldn't find "{query}"
        </h3>
        <p className="text-amber-700 mb-4">
          Try rephrasing your search, or contact ACC Solid Waste at{" "}
          <a href="tel:7066133512" className="font-medium underline">
            706-613-3512
          </a>{" "}
          for help.
        </p>
        {result.suggestions && result.suggestions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-amber-800 mb-2">
              Did you mean one of these?
            </p>
            <div className="flex flex-wrap gap-2">
              {result.suggestions.map((s) => {
                const config = getCategoryConfig(s.category);
                return (
                  <span
                    key={s.slug}
                    className={`px-3 py-1 text-sm rounded-full ${config.bgColor} ${config.color} border ${config.borderColor}`}
                  >
                    {s.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const config = getCategoryConfig(result.item.category);
  const verifiedDate = showVerifiedDates ? formatVerifiedDate(result.item.lastVerifiedAt) : null;
  const daysSince = showVerifiedDates ? getDaysSinceVerified(result.item.lastVerifiedAt) : null;
  const isStale = showVerifiedDates && daysSince !== null && daysSince > 180;

  return (
    <div className={`p-6 rounded-2xl border-2 ${config.borderColor} ${config.bgColor}`}>
      {/* AI disclaimer banner */}
      {result.source === "ai" && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-xl text-sm text-yellow-800">
          <strong>🤖 AI-generated answer</strong> — This item wasn't in our verified database.
          {result.confidence === "low" && (
            <span>
              {" "}
              Confidence is low — please verify with ACC Solid Waste at{" "}
              <a href="tel:7066133512" className="font-medium underline">
                706-613-3512
              </a>
              .
            </span>
          )}
        </div>
      )}

      {/* Stale data warning */}
      {isStale && result.isVerified && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <strong>📅 Heads up</strong> — This info was last verified{" "}
          {verifiedDate}. ACC guidelines may have changed since then. Consider
          confirming with{" "}
          <a href="tel:7066133512" className="font-medium underline">
            ACC Solid Waste
          </a>{" "}
          if you're unsure.
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <span className="text-4xl">{config.emoji}</span>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 capitalize">
            {result.item.name}
          </h3>
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.color} ${config.bgColor} border ${config.borderColor}`}
            >
              {config.label}
            </span>
            {result.item.material && (
              <span className="text-sm text-gray-500">
                {result.item.material.name}
              </span>
            )}
            {result.isVerified && (
              <VerifiedBadge date={verifiedDate} isStale={isStale} />
            )}
          </div>
        </div>
      </div>

      {/* Category description */}
      <p className={`text-sm font-medium mb-3 ${config.color}`}>
        {config.description}
      </p>

      {/* Instructions */}
      <div className="bg-white/60 rounded-xl p-4 mb-3">
        <h4 className="font-semibold text-gray-800 mb-1">How to dispose</h4>
        <p className="text-gray-700">{result.item.instructions}</p>
      </div>

      {/* Tips */}
      {result.item.tips && (
        <div className="bg-white/60 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-1">💡 Tip</h4>
          <p className="text-gray-600">{result.item.tips}</p>
        </div>
      )}

      {/* Related suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <p className="text-sm font-medium text-gray-600 mb-2">Related items</p>
          <div className="flex flex-wrap gap-2">
            {result.suggestions.map((s) => {
              const sConfig = getCategoryConfig(s.category);
              return (
                <span
                  key={s.slug}
                  className={`px-3 py-1 text-sm rounded-full ${sConfig.bgColor} ${sConfig.color} border ${sConfig.borderColor} cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  {s.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Report issue */}
      <ReportIssueButton
        itemName={result.item.name}
        itemSlug={result.item.slug ?? null}
      />
    </div>
  );
}

function VerifiedBadge({
  date,
  isStale,
}: {
  date: string | null;
  isStale: boolean;
}) {
  return (
    <span
      className={`text-sm flex items-center gap-1 ${
        isStale ? "text-amber-600" : "text-green-600"
      }`}
      title={date ? `Last verified: ${date}` : "Verified"}
    >
      {isStale ? "⚠ Verified " : "✓ Verified "}
      {date && (
        <span className="text-xs text-gray-400 font-normal">{date}</span>
      )}
    </span>
  );
}
