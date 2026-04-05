// ⚠️  SERVER-ONLY — do not import this file from any "use client" component.
// It depends on "next/headers" which is unavailable in browser bundles.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

// ─── Server client (Server Components) ───────────────────────────────────────
// Async because cookies() is async in Next.js 16.
// Reads the session cookie so auth state is available in server-rendered pages.
// Returns null when env vars are not configured.

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Components cannot set cookies directly.
          // The proxy handles token refresh instead.
        }
      },
    },
  });
}

// ─── Proxy client (proxy.ts only) ────────────────────────────────────────────
// Reads session cookies from the incoming request and writes refreshed tokens
// back onto the response. Only call this inside proxy.ts.

export function getSupabaseProxyClient(
  request: NextRequest,
  response: NextResponse
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Write updated tokens to both the forwarded request and the response
        // so the browser receives the refreshed session cookie.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
}
