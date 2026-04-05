import { createBrowserClient } from "@supabase/ssr";

// ─── Shared database types ────────────────────────────────────────────────────
// Mirrors the `reports` table in Supabase.
//
//   create table reports (
//     id           uuid primary key,
//     session_id   text        not null,
//     session_title text       not null,
//     submitted_at timestamptz not null,
//     attendees    int         not null,
//     engagement   int         not null check (engagement between 1 and 5),
//     highlights   text        not null,
//     challenges   text        not null,
//     notes        text        not null default '',
//     created_at   timestamptz not null default now()
//   );
//
//   alter table reports enable row level security;
//   create policy "Allow anon insert" on reports for insert with check (true);
//   create policy "Allow anon select" on reports for select using (true);

export type DbReport = {
  id: string;
  session_id: string;
  session_title: string;
  submitted_at: string;
  attendees: number;
  engagement: number;
  highlights: string;
  challenges: string;
  notes: string;
};

// ─── Browser client (Client Components only) ──────────────────────────────────
// Safe to import from any Client Component ("use client" files).
// Uses @supabase/ssr so the session is stored in cookies, making it visible
// to the server-side clients in supabase-server.ts.
// Singleton to avoid duplicate instances across re-renders.

let _browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  _browserClient = createBrowserClient(url, key);
  return _browserClient;
}
