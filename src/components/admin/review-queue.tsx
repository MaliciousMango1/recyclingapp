"use client";

import { useState } from "react";
import { api } from "~/lib/trpc";
import { ItemForm } from "./item-form";

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
  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  // Pre-fill the form with the query as the item name
  // Pass undefined for initialData so ItemForm treats this as a create
  const defaultValues = {
    name: query.charAt(0).toUpperCase() + query.slice(1),
    slug,
    aliases: [query.toLowerCase()],
    category: "LANDFILL" as string,
    instructions: "",
    tips: null,
    materialId: null,
    sourceUrl: null,
    isVerified: true,
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Fill in the disposal details to add this as a verified item. The search
        query will be added as an alias automatically.
      </p>
      <ItemForm
        defaultValues={defaultValues}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </div>
  );
}
