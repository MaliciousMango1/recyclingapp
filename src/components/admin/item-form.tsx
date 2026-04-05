"use client";

import { useState } from "react";
import { api } from "~/lib/trpc";

interface ItemFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    aliases: string[];
    category: string;
    instructions: string;
    tips: string | null;
    materialId: string | null;
    sourceUrl: string | null;
    isVerified: boolean;
    lastVerifiedAt?: string | Date | null;
  };
  defaultValues?: {
    name?: string;
    slug?: string;
    aliases?: string[];
    category?: string;
    instructions?: string;
    tips?: string | null;
    materialId?: string | null;
    sourceUrl?: string | null;
    isVerified?: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = [
  { value: "RECYCLE", label: "♻️ Recyclable" },
  { value: "COMPOST", label: "🌱 Compostable" },
  { value: "LANDFILL", label: "🗑️ Landfill" },
  { value: "HAZARDOUS", label: "⚠️ Hazardous" },
  { value: "SPECIAL_DROPOFF", label: "📍 Special Drop-off" },
  { value: "REUSE", label: "💜 Reuse / Donate" },
];

export function ItemForm({ initialData, defaultValues, onSuccess, onCancel }: ItemFormProps) {
  const isEdit = !!initialData;
  const defaults = initialData ?? defaultValues;

  const [name, setName] = useState(defaults?.name ?? "");
  const [slug, setSlug] = useState(defaults?.slug ?? "");
  const [aliasesStr, setAliasesStr] = useState(defaults?.aliases?.join(", ") ?? "");
  const [category, setCategory] = useState(defaults?.category ?? "RECYCLE");
  const [instructions, setInstructions] = useState(defaults?.instructions ?? "");
  const [tips, setTips] = useState(defaults?.tips ?? "");
  const [sourceUrl, setSourceUrl] = useState(defaults?.sourceUrl ?? "");
  const [isVerified, setIsVerified] = useState(defaults?.isVerified ?? true);
  const [reVerify, setReVerify] = useState(!isEdit); // auto-verify on create
  const [error, setError] = useState("");

  const materials = api.admin.listMaterials.useQuery();

  const [materialId, setMaterialId] = useState(defaults?.materialId ?? "");

  const createItem = api.admin.createItem.useMutation({
    onSuccess,
    onError: (err) => setError(err.message),
  });

  const updateItem = api.admin.updateItem.useMutation({
    onSuccess,
    onError: (err) => setError(err.message),
  });

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEdit) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const aliases = aliasesStr
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);

    const data = {
      name,
      slug,
      aliases,
      category: category as any,
      instructions,
      tips: tips || null,
      materialId: materialId || null,
      sourceUrl: sourceUrl || null,
      isVerified,
      ...(reVerify && isVerified ? { lastVerifiedAt: new Date().toISOString() } : {}),
    };

    if (isEdit && initialData) {
      updateItem.mutate({ id: initialData.id, ...data });
    } else {
      createItem.mutate(data);
    }
  };

  const isPending = createItem.isPending || updateItem.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg 
                       focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
            placeholder="e.g. Pizza Box"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg 
                       focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200 
                       font-mono text-sm"
            placeholder="pizza-box"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white
                       focus:border-green-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Group
          </label>
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white
                       focus:border-green-500 focus:outline-none"
          >
            <option value="">None</option>
            {materials.data?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m._count.items} items)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aliases */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aliases (comma-separated)
        </label>
        <input
          type="text"
          value={aliasesStr}
          onChange={(e) => setAliasesStr(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg 
                     focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
          placeholder="e.g. pizza boxes, pizza cardboard, greasy pizza box"
        />
        <p className="text-xs text-gray-400 mt-1">
          Alternative terms people might search for
        </p>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Disposal Instructions *
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg 
                     focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
          placeholder="How should ACC residents dispose of this item?"
        />
      </div>

      {/* Tips */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tips (optional)
        </label>
        <textarea
          value={tips}
          onChange={(e) => setTips(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg 
                     focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
          placeholder="Any helpful tips or common misconceptions"
        />
      </div>

      {/* Source URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source URL (optional)
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg 
                     focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200"
          placeholder="https://www.accgov.com/..."
        />
      </div>

      {/* Verified */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isVerified"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="isVerified" className="text-sm text-gray-700">
            Mark as verified (confirmed against ACC guidelines)
          </label>
        </div>

        {isEdit && initialData?.lastVerifiedAt && (
          <p className="text-xs text-gray-400 ml-6">
            Last verified:{" "}
            {new Date(initialData.lastVerifiedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        {isVerified && (
          <div className="flex items-center gap-2 ml-6">
            <input
              type="checkbox"
              id="reVerify"
              checked={reVerify}
              onChange={(e) => setReVerify(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="reVerify" className="text-sm text-gray-600">
              Re-verify today (I've confirmed this is still accurate)
            </label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium 
                     hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl 
                     hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
