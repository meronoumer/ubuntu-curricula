"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/app/_lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Authentication is not configured.");
      setLoading(false);
      return;
    }

    // signInWithPassword returns the user object directly — we read the role
    // from it immediately so we can redirect without a second network call.
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Role-based redirect:
    //   admin  → /admin dashboard
    //   anyone else (facilitator or no role set) → /sessions
    const role = data.user?.user_metadata?.role;
    const destination = role === "admin" ? "/admin" : "/sessions";

    // router.refresh() re-runs the proxy with the new session cookie before
    // navigating so the destination page sees the authenticated state.
    router.refresh();
    router.push(destination);
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <div className="w-full max-w-sm space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--color-green)" }}
          >
            Ubuntu Curriculum
          </h1>
          <p className="text-sm" style={{ color: "var(--color-brown)" }}>
            Sign in to your account
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border p-6 space-y-4"
          style={{ borderColor: "var(--color-beige)" }}
        >
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--color-beige)",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ["--tw-ring-color" as any]: "var(--color-green)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-beige)" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-green)" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Role note */}
        <p className="text-center text-xs" style={{ color: "var(--color-brown)", opacity: 0.6 }}>
          Admins are redirected to the dashboard automatically.
        </p>

      </div>
    </main>
  );
}
