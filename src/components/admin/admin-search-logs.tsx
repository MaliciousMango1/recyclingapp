"use client";

import { useState } from "react";
import { api } from "~/lib/trpc";

export function AdminSearchLogs() {
  const [page, setPage] = useState(1);
  const [matchedFilter, setMatchedFilter] = useState<boolean | undefined>(undefined);
  const [aiFallbackFilter, setAiFallbackFilter] = useState<boolean | undefined>(undefined);
  const [dismissedFilter, setDismissedFilter] = useState<boolean | undefined>(undefined);

  const logs = api.admin.getSearchLogs.useQuery({
    page,
    perPage: 50,
    matched: matchedFilter,
    aiFallback: aiFallbackFilter,
    dismissed: dismissedFilter,
  });

  const setFilter = (setter: (v: boolean | undefined) => void, value: string) => {
    setter(value === "" ? undefined : value === "true");
    setPage(1);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={matchedFilter === undefined ? "" : String(matchedFilter)}
          onChange={(e) => setFilter(setMatchedFilter, e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:border-green-500 focus:outline-none"
        >
          <option value="">All Results</option>
          <option value="true">Matched</option>
          <option value="false">Unmatched</option>
        </select>
        <select
          value={aiFallbackFilter === undefined ? "" : String(aiFallbackFilter)}
          onChange={(e) => setFilter(setAiFallbackFilter, e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:border-green-500 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="true">AI Fallback</option>
          <option value="false">Curated</option>
        </select>
        <select
          value={dismissedFilter === undefined ? "" : String(dismissedFilter)}
          onChange={(e) => setFilter(setDismissedFilter, e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl bg-white focus:border-green-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Dismissed</option>
        </select>
        {(matchedFilter !== undefined || aiFallbackFilter !== undefined || dismissedFilter !== undefined) && (
          <button
            onClick={() => {
              setMatchedFilter(undefined);
              setAiFallbackFilter(undefined);
              setDismissedFilter(undefined);
              setPage(1);
            }}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            Clear filters
          </button>
        )}
      </div>

      {logs.isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : logs.data?.logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No search logs found.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Query</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Result</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.data?.logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{log.query}</td>
                    <td className="py-3 px-4">
                      {log.dismissed ? (
                        <span className="text-xs font-medium text-gray-400">Dismissed</span>
                      ) : log.matched ? (
                        <span className="text-xs font-medium text-green-600">Matched</span>
                      ) : (
                        <span className="text-xs font-medium text-red-500">Unmatched</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {log.aiFallback ? (
                        <span className="text-xs font-medium text-amber-600">AI Fallback</span>
                      ) : (
                        <span className="text-xs text-gray-400">Curated</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {logs.data && logs.data.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Page {logs.data.page} of {logs.data.pages} ({logs.data.total} logs)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (logs.data?.pages ?? 1)}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
