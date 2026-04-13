"use client";

import { useState } from "react";
import { api } from "~/lib/trpc";
import { getCategoryConfig } from "~/lib/categories";
import { ItemForm } from "./item-form";

export function AdminItemsList({ initialVerified }: { initialVerified?: boolean }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | undefined>(initialVerified);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const utils = api.useUtils();

  const items = api.admin.listItems.useQuery({
    search: search || undefined,
    category: (categoryFilter || undefined) as "RECYCLE" | "COMPOST" | "LANDFILL" | "HAZARDOUS" | "SPECIAL_DROPOFF" | "REUSE" | undefined,
    verified: verifiedFilter,
    page,
    perPage: 25,
  });

  const deleteItem = api.admin.deleteItem.useMutation({
    onSuccess: () => utils.admin.listItems.invalidate(),
  });

  const categories = [
    "RECYCLE", "COMPOST", "LANDFILL", "HAZARDOUS", "SPECIAL_DROPOFF", "REUSE",
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search items..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl 
                     focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-xl bg-white
                     focus:border-green-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {getCategoryConfig(c).emoji} {getCategoryConfig(c).label}
            </option>
          ))}
        </select>
        <select
          value={verifiedFilter === undefined ? "" : String(verifiedFilter)}
          onChange={(e) => {
            setVerifiedFilter(e.target.value === "" ? undefined : e.target.value === "true");
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-200 rounded-xl bg-white
                     focus:border-green-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium 
                     hover:bg-green-700 transition-colors whitespace-nowrap"
        >
          + Add Item
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 p-6 bg-white rounded-2xl border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Create New Item</h3>
          <ItemForm
            onSuccess={() => {
              setShowCreate(false);
              utils.admin.listItems.invalidate();
            }}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      {/* Items Table */}
      {items.isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : items.data?.items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No items found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Material</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.data?.items.map((item) => {
                  const config = getCategoryConfig(item.category);

                  if (editingId === item.id) {
                    return (
                      <tr key={item.id}>
                        <td colSpan={5} className="p-4">
                          <ItemForm
                            initialData={item}
                            onSuccess={() => {
                              setEditingId(null);
                              utils.admin.listItems.invalidate();
                            }}
                            onCancel={() => setEditingId(null)}
                          />
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {item.aliases.slice(0, 3).join(", ")}
                          {item.aliases.length > 3 && ` +${item.aliases.length - 3}`}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
                          {config.emoji} {config.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                        {item.material?.name ?? "—"}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {item.isVerified ? (
                          <span className="text-green-600 text-xs font-medium">✓ Verified</span>
                        ) : (
                          <span className="text-amber-600 text-xs font-medium">Unverified</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}"?`)) {
                              deleteItem.mutate({ id: item.id });
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {items.data && items.data.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Page {items.data.page} of {items.data.pages} ({items.data.total} items)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg 
                             hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (items.data?.pages ?? 1)}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg 
                             hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
