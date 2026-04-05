"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  InviteRequired: "You need an invite code to create an account.",
  InvalidInvite: "That invite code is invalid, expired, or already used.",
  OAuthAccountNotLinked: "This email is already associated with another sign-in method.",
};

export default function SignInPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [mode, setMode] = useState<"signin" | "invite">(
    errorParam === "InviteRequired" || errorParam === "InvalidInvite"
      ? "invite"
      : "signin"
  );
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const errorMessage = errorParam ? ERROR_MESSAGES[errorParam] ?? "An error occurred during sign in." : null;

  const handleSignIn = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/admin" });
  };

  const handleInviteSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    // Set a short-lived cookie with the invite code before starting OAuth
    document.cookie = `invite_code=${encodeURIComponent(inviteCode.trim())}; path=/; max-age=600; samesite=lax`;
    signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-6">Athens Recycling Guide</p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === "signin"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("invite")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === "invite"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Join with Invite
          </button>
        </div>

        {mode === "signin" ? (
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200
                       rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {loading ? "Redirecting..." : "Sign in with Google"}
          </button>
        ) : (
          <form onSubmit={handleInviteSignIn}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl
                         focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Enter your invite code"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !inviteCode.trim()}
              className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-2.5
                         bg-green-600 text-white rounded-xl font-medium hover:bg-green-700
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              {loading ? "Redirecting..." : "Continue with Google"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            &larr; Back to site
          </a>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
