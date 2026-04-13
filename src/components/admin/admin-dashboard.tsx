"use client";

import { api } from "~/lib/trpc";

type Tab = "dashboard" | "items" | "review" | "reports" | "settings" | "users" | "searches";

export function AdminDashboard({
  onNavigate,
}: {
  onNavigate: (tab: Tab, opts?: { verified?: boolean }) => void;
}) {
  const stats = api.admin.getStats.useQuery(undefined, {
    retry: false,
  });

  if (stats.isLoading) {
    return <LoadingSkeleton />;
  }

  if (stats.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
        {stats.error.message === "Invalid admin credentials"
          ? "Invalid password. Please try again."
          : `Error: ${stats.error.message}`}
      </div>
    );
  }

  const data = stats.data;
  if (!data) return null;

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Items" value={data.totalItems} onClick={() => onNavigate("items")} />
        <StatCard label="Verified" value={data.verifiedItems} color="green" onClick={() => onNavigate("items", { verified: true })} />
        <StatCard label="Total Searches" value={data.totalSearches} onClick={() => onNavigate("searches")} />
        <StatCard label="Match Rate" value={`${data.matchRate}%`} color={data.matchRate > 70 ? "green" : "amber"} onClick={() => onNavigate("searches")} />
        <StatCard label="Unmatched" value={data.unmatchedSearches} color="red" onClick={() => onNavigate("review")} />
        <StatCard label="AI Fallbacks" value={data.aiFallbacks} color="amber" onClick={() => onNavigate("review")} />
        <StatCard label="Open Reports" value={data.openReports} color={data.openReports > 0 ? "red" : "green"} onClick={() => onNavigate("reports")} />
      </div>

      {/* Top Searches */}
      {data.topSearches.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Searches (Last 7 Days)
          </h3>
          <div className="space-y-2">
            {data.topSearches.map((s, i) => (
              <div
                key={s.query}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-gray-400 w-6">
                    {i + 1}.
                  </span>
                  <span className="text-gray-700">{s.query}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {s.count} searches
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "gray",
  onClick,
}: {
  label: string;
  value: string | number;
  color?: "gray" | "green" | "red" | "amber";
  onClick?: () => void;
}) {
  const colorMap = {
    gray: "bg-white border-gray-100",
    green: "bg-green-50 border-green-100",
    red: "bg-red-50 border-red-100",
    amber: "bg-amber-50 border-amber-100",
  };

  const baseClass = `p-4 rounded-xl border text-left w-full ${colorMap[color]}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClass} hover:ring-2 hover:ring-offset-1 hover:ring-gray-200 transition-shadow`}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </button>
    );
  }

  return (
    <div className={baseClass}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-100 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
          <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
