// Session cache — persists fetched sessions to localStorage so the app
// can show stale-but-valid data when Supabase is unreachable or the
// device is offline (client-side navigation scenario).
//
// This file is CLIENT-ONLY: import only from "use client" components.

import type { SessionStatus } from "./mock-data";

export type CachedSession = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  assignedTo: string;
  status: SessionStatus;
  totalSteps: number;
};

const SESSIONS_KEY = "uf_session_list";
const CACHE_META_KEY = "uf_session_list_meta";

// ─── Write ────────────────────────────────────────────────────────────────────

export function saveSessions(sessions: CachedSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    localStorage.setItem(CACHE_META_KEY, JSON.stringify({ savedAt: new Date().toISOString() }));
  } catch {
    // localStorage unavailable — silently degrade
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function loadSessions(): CachedSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CachedSession[];
  } catch {
    return [];
  }
}

/** Returns how long ago sessions were cached, or null if never cached. */
export function sessionCacheAge(): string | null {
  try {
    const raw = localStorage.getItem(CACHE_META_KEY);
    if (!raw) return null;
    const { savedAt } = JSON.parse(raw) as { savedAt: string };
    const diffMs = Date.now() - new Date(savedAt).getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    return `${diffH}h ago`;
  } catch {
    return null;
  }
}
