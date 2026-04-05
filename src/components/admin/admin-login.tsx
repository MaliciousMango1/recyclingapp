"use client";

import { useState } from "react";
import { useAdminAuth } from "./admin-auth-context";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setError(false);
      login(password.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-6">Athens Recycling Guide</p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl 
                       focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Enter admin password"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">Invalid password</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2.5 bg-green-600 text-white rounded-xl 
                       font-medium hover:bg-green-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
