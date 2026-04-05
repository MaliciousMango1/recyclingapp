"use client";

import { useState } from "react";
import { AdminAuthProvider, useAdminAuth } from "~/components/admin/admin-auth-context";
import { AdminLogin } from "~/components/admin/admin-login";
import { AdminDashboard } from "~/components/admin/admin-dashboard";
import { AdminItemsList } from "~/components/admin/admin-items-list";
import { ReviewQueue } from "~/components/admin/review-queue";
import { AdminReports } from "~/components/admin/admin-reports";
import { AdminSettings } from "~/components/admin/admin-settings";

type Tab = "dashboard" | "items" | "review" | "reports" | "settings";

function AdminContent() {
  const { isAuthenticated, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "dashboard", label: "Dashboard", emoji: "📊" },
    { id: "items", label: "Items", emoji: "📦" },
    { id: "review", label: "Review Queue", emoji: "🔍" },
    { id: "reports", label: "Reports", emoji: "🚩" },
    { id: "settings", label: "Settings", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              ♻️ Athens Recycling Guide
            </h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to site
            </a>
            <button
              onClick={logout}
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "items" && <AdminItemsList />}
        {activeTab === "review" && <ReviewQueue />}
        {activeTab === "reports" && <AdminReports />}
        {activeTab === "settings" && <AdminSettings />}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}
