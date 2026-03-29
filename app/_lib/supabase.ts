import { createClient } from "@supabase/supabase-js";

// ─── Database types ───────────────────────────────────────────────────────────
// Mirrors the `reports` table in Supabase.
//
// Run this SQL in the Supabase SQL editor to create the table:
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
//   -- Allow anonymous inserts while auth is not yet wired:
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

// ─── Browser client singleton ─────────────────────────────────────────────────
// Returns null when env vars are not configured so callers can
// skip the sync gracefully instead of throwing.

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  _client = createClient(url, key);
  return _client;
}

// ─── Server client (fresh per call) ───────────────────────────────────────────
// Use this in Server Components and Route Handlers. A fresh instance per call
// avoids sharing state across requests in the same worker process.
// Returns null when env vars are not configured.

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}
