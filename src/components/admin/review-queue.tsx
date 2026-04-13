"use client";

import { useState, useEffect } from "react";
import { api } from "~/lib/trpc";

export function ReviewQueue() {
  const [page, setPage] = useState(1);
  const [promotingQuery, setPromotingQuery] = useState<string | null>(null);

  const utils = api.useUtils();

  const queue = api.admin.getReviewQueue.useQuery({ page, perPage: 20 });

  const dismiss = api.admin.dismissFromQueue.useMutation({
    onSuccess: () => utils.admin.getReviewQueue.invalidate(),
  });

  if (queue.isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading review queue...</div>;
  }

  if (!queue.data || queue.data.queries.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <span className="text-4xl">🎉</span>
        <h3 className="text-lg font-semibold text-gray-900 mt-3">Queue is empty!</h3>
        <p className="text-gray-500 mt-1">
          No unmatched AI searches to review right now.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        These are searches that didn't match any curated item and fell through to AI.
        Review each one and either promote it to a verified item or dismiss it.
      </p>

      <div className="space-y-3">
        {queue.data.queries.map((entry) => (
          <div
            key={entry.query}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4">
              <div>
                <span className="font-medium text-gray-900 capitalize">
                  "{entry.query}"
                </span>
                <span className="ml-3 text-sm text-gray-400">
                  searched {entry.searchCount} time{entry.searchCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPromotingQuery(
                      promotingQuery === entry.query ? null : entry.query
                    )
                  }
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg 
                             font-medium hover:bg-green-700 transition-colors"
                >
                  {promotingQuery === entry.query ? "Close" : "Promote to Item"}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Dismiss "${entry.query}" from the queue?`)) {
                      dismiss.mutate({ query: entry.query });
                    }
                  }}
                  className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm 
                             rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Promote form */}
            {promotingQuery === entry.query && (
              <div className="border-t border-gray-100 p-4 bg-green-50/30">
                <PromoteForm
                  query={entry.query}
                  onSuccess={() => {
                    setPromotingQuery(null);
                    utils.admin.getReviewQueue.invalidate();
                    utils.admin.listItems.invalidate();
                    utils.admin.getStats.invalidate();
                  }}
                  onCancel={() => setPromotingQuery(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {queue.data.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            Page {queue.data.page} of {queue.data.pages} ({queue.data.total} queries)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg 
                         hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= queue.data.pages}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg 
                         hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PromoteForm({
  query,
  onSuccess,
  onCancel,
}: {
  query: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState("");

  const promote = api.admin.promoteFromQueue.useMutation({
    onSuccess,
    onError: (err) => setError(err.message),
  });

  const aiSuggestion = api.admin.getAISuggestion.useQuery(
    { query },
    { staleTime: Infinity, retry: false }
  );

  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const [name, setName] = useState(query.charAt(0).toUpperCase() + query.slice(1));
  const [slugValue, setSlugValue] = useState(slug);
  const [aliasesStr, setAliasesStr] = useState(query.toLowerCase());
  const [category, setCategory] = useState("LANDFILL");
  const [instructions, setInstructions] = useState("");
  const [tips, setTips] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  // Pre-fill from AI suggestion when it loads
  useEffect(() => {
    if (aiSuggestion.data) {
      setCategory(aiSuggestion.data.category);
      setInstructions(aiSuggestion.data.instructions);
      setTips(aiSuggestion.data.tips ?? "");
    }
  }, [aiSuggestion.data]);

  const categories = [
    { value: "RECYCLE", label: "Recyclable" },
    { value: "COMPOST", label: "Compostable" },
    { value: "LANDFILL", label: "Landfill" },
    { value: "HAZARDOUS", label: "Hazardous" },
    { value: "SPECIAL_DROPOFF", label: "Special Drop-off" },
    { value: "REUSE", label: "Reuse / Donate" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const aliases = aliasesStr
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);

    promote.mutate({
      query,
      item: {
        name,
        slug: slugValue,
        aliases,
        category: category as any,
        instructions,
        tips: tips || null,
        materialId: null,
        sourceUrl: sourceUrl || null,
        isVerified: true,
        lastVerifiedAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Fill in the disposal details to add this as a verified item. The search
        query will be added as an alias automatically.
      </p>

      {aiSuggestion.isLoading && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
          Fetching AI suggestion...
        </div>
      )}

      {aiSuggestion.data && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          Pre-filled with AI suggestion (confidence: {aiSuggestion.data.confidence}). Review before promoting.
        </div>
      )}

      {aiSuggestion.isError && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
          Could not fetch AI suggestion. Fill in manually.
        </div>
      )}

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlugValue(
                  e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
                );
              }}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:border-green-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aliases (comma-separated)</label>
          <input
            type="text"
            value={aliasesStr}
            onChange={(e) => setAliasesStr(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disposal Instructions *</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
            placeholder="How should ACC residents dispose of this item?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tips (optional)</label>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source URL (optional)</label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
            placeholder="https://www.accgov.com/..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={promote.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {promote.isPending ? "Promoting..." : "Promote to Item"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
