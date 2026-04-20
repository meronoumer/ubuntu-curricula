import { createBrowserClient } from "@supabase/ssr";

// ─── Shared database types ────────────────────────────────────────────────────
// Mirrors the `reports` table in Supabase.
//
// Example schema:
//   create table reports (
//     id            uuid primary key,
//     session_id    text        not null,
//     session_title text        not null,
//     submitted_at  timestamptz not null,
//     submitted_by  text,
//     attendees     int         not null,
//     engagement    int         not null check (engagement between 1 and 5),
//     highlights    text        not null,
//     challenges    text        not null,
//     notes         text        not null default '',
//     fidelity_score int,
//     created_at    timestamptz not null default now()
//   );
//
//   alter table reports enable row level security;
//   create policy "Allow anon insert" on reports for insert with check (true);
//   create policy "Allow anon select" on reports for select using (true);

// ─── Sessions table ───────────────────────────────────────────────────────────
// Mirrors the `sessions` table in Supabase.
export type DbSession = {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO date string (YYYY-MM-DD)
  location: string | null;

  // Current preferred field
  assigned_to: string | null;

  // Legacy / transitional field from earlier SQL
  facilitator_email?: string | null;

  // Maps to a MOCK_STEPS key
  template_id: string | null;

  // Keep this flexible while the DB stabilizes
  status: "upcoming" | "in-progress" | "completed" | string;

  // Optional because these may not yet exist in the table
  started_at?: string | null;
  completed_at?: string | null;

  created_at?: string | null;
};

export type DbReport = {
  id: string;
  session_id: string;
  session_title: string;
  submitted_at: string;
  submitted_by: string | null;
  attendees: number;
  engagement: number;
  highlights: string;
  challenges: string;
  notes: string;
  fidelity_score: number | null; // 0–100
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