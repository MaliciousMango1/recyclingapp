"use client";

import { useState } from "react";
import { api } from "~/lib/trpc";

const reportTypeLabels: Record<string, { label: string; color: string }> = {
  incorrect: { label: "Incorrect", color: "bg-red-100 text-red-700" },
  outdated: { label: "Outdated", color: "bg-amber-100 text-amber-700" },
  missing: { label: "Missing details", color: "bg-blue-100 text-blue-700" },
  other: { label: "Other", color: "bg-gray-100 text-gray-700" },
};

export function AdminReports() {
  const [showResolved, setShowResolved] = useState(false);
  const [page, setPage] = useState(1);

  const utils = api.useUtils();

  const reports = api.admin.getReports.useQuery({
    resolved: showResolved,
    page,
    perPage: 20,
  });

  const resolve = api.admin.resolveReport.useMutation({
    onSuccess: () => {
      utils.admin.getReports.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  const deleteReport = api.admin.deleteReport.useMutation({
    onSuccess: () => {
      utils.admin.getReports.invalidate();
      utils.admin.getStats.invalidate();
    },
  });

  return (
    <div>
      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setShowResolved(false); setPage(1); }}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            !showResolved
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Open
        </button>
        <button
          onClick={() => { setShowResolved(true); setPage(1); }}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            showResolved
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Resolved
        </button>
      </div>

      {reports.isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading reports...</div>
      ) : !reports.data || reports.data.reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <span className="text-4xl">{showResolved ? "📋" : "🎉"}</span>
          <h3 className="text-lg font-semibold text-gray-900 mt-3">
            {showResolved ? "No resolved reports" : "No open reports!"}
          </h3>
          <p className="text-gray-500 mt-1">
            {showResolved
              ? "Resolved reports will appear here."
              : "No issues have been reported by users."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.data.reports.map((report) => {
            const typeInfo = reportTypeLabels[report.reportType] ?? reportTypeLabels.other!;

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {report.itemName}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      {report.itemSlug && (
                        <span className="text-xs text-gray-400 font-mono">
                          /{report.itemSlug}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{report.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Reported{" "}
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {report.resolvedAt && (
                        <span>
                          {" · Resolved "}
                          {new Date(report.resolvedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </p>
                  </div>

                  {!showResolved && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => resolve.mutate({ id: report.id })}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg 
                                   font-medium hover:bg-green-700 transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this report?")) {
                            deleteReport.mutate({ id: report.id });
                          }
                        }}
                        className="px-3 py-1.5 text-sm border border-gray-200 text-gray-600 
                                   rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {reports.data.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Page {reports.data.page} of {reports.data.pages} ({reports.data.total} reports)
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
                  disabled={page >= reports.data.pages}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg 
                             hover:bg-gray-50 disabled:opacity-50"
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
