"use client";

import { api } from "~/lib/trpc";

export function AdminSettings() {
  const utils = api.useUtils();

  const settings = api.admin.getSiteSettings.useQuery();

  const updateSetting = api.admin.updateSiteSetting.useMutation({
    onSuccess: () => {
      utils.admin.getSiteSettings.invalidate();
    },
  });

  if (settings.isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading settings...</div>;
  }

  if (settings.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
        Error loading settings: {settings.error.message}
      </div>
    );
  }

  const data = settings.data;
  if (!data) return null;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {/* Show Verified Dates */}
        <SettingRow
          title="Show verified dates"
          description='Display "Last verified" dates on search results. Turn this off if dates are getting stale and you haven&apos;t had a chance to re-verify items yet.'
          enabled={data.showVerifiedDates}
          loading={updateSetting.isPending}
          onToggle={(enabled) =>
            updateSetting.mutate({
              key: "showVerifiedDates",
              value: enabled ? "true" : "false",
            })
          }
        />
      </div>

      <p className="mt-4 text-sm text-gray-400">
        Settings take effect immediately for all users — no redeploy needed.
      </p>
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  loading,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  loading: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-5 gap-6">
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full 
                    border-2 border-transparent transition-colors duration-200 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    disabled:opacity-50 ${
                      enabled ? "bg-green-600" : "bg-gray-200"
                    }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full 
                      bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        enabled ? "translate-x-5" : "translate-x-0"
                      }`}
        />
      </button>
    </div>
  );
}
