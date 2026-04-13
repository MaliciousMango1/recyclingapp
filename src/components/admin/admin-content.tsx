"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AdminDashboard } from "~/components/admin/admin-dashboard";
import { AdminItemsList } from "~/components/admin/admin-items-list";
import { ReviewQueue } from "~/components/admin/review-queue";
import { AdminReports } from "~/components/admin/admin-reports";
import { AdminSettings } from "~/components/admin/admin-settings";
import { AdminUsers } from "~/components/admin/admin-users";

type Tab = "dashboard" | "items" | "review" | "reports" | "settings" | "users";

export function AdminContent() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [itemsInitialVerified, setItemsInitialVerified] = useState<boolean | undefined>(undefined);

  const isAdmin = session?.user?.role === "ADMIN";

  const tabs: { id: Tab; label: string; emoji: string; adminOnly?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", emoji: "\u{1F4CA}" },
    { id: "items", label: "Items", emoji: "\u{1F4E6}" },
    { id: "review", label: "Review Queue", emoji: "\u{1F50D}" },
    { id: "reports", label: "Reports", emoji: "\u{1F6A9}" },
    { id: "settings", label: "Settings", emoji: "\u{2699}\u{FE0F}" },
    { id: "users", label: "Users", emoji: "\u{1F465}", adminOnly: true },
  ];

  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {"\u267B\uFE0F"} Athens Recycling Guide
            </h1>
            <p className="text-sm text-gray-500">
              Admin Panel
              {session?.user?.name && (
                <span className="ml-2 text-gray-400">
                  — {session.user.name}
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                    {session.user.role}
                  </span>
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              &larr; Back to site
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setItemsInitialVerified(undefined); setActiveTab(tab.id); }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <AdminDashboard
            onNavigate={(tab, opts) => {
              setItemsInitialVerified(opts?.verified);
              setActiveTab(tab);
            }}
          />
        )}
        {activeTab === "items" && <AdminItemsList initialVerified={itemsInitialVerified} />}
        {activeTab === "review" && <ReviewQueue />}
        {activeTab === "reports" && <AdminReports />}
        {activeTab === "settings" && <AdminSettings />}
        {activeTab === "users" && isAdmin && <AdminUsers />}
      </main>
    </div>
  );
}
