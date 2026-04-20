import { getSupabaseClient, type DbReport } from "./supabase";

export type Report = {
  id: string;
  sessionId: string;
  sessionTitle: string;
  submittedAt: string;      // ISO datetime string
  submittedBy: string;      // email of the facilitator who submitted
  attendees: number;
  engagement: number;       // 1–5
  highlights: string;
  challenges: string;
  notes: string;
  fidelityScore?: number;   // 0–100, computed from step-level tracking
  synced: boolean;          // true once uploaded to Supabase
};

const STORAGE_KEY = "uf_reports";

// ─── localStorage helpers ─────────────────────────────────────────────────────

export function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Report>[];
    // Back-fill defaults for reports created before these fields existed
    return parsed.map((r) => ({ synced: false, submittedBy: "", ...r } as Report));
  } catch {
    return [];
  }
}

function persistReports(reports: Report[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // localStorage unavailable — silently degrade
  }
}

export function saveReport(report: Omit<Report, "id" | "submittedAt" | "synced">): Report {
  const full: Report = {
    ...report,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    synced: false,
  };
  persistReports([...loadReports(), full]);
  return full;
}

export function loadPendingReports(): Report[] {
  return loadReports().filter((r) => !r.synced);
}

export function markReportsSynced(ids: string[]) {
  const idSet = new Set(ids);
  const updated = loadReports().map((r) =>
    idSet.has(r.id) ? { ...r, synced: true } : r
  );
  persistReports(updated);
}

// ─── Supabase sync ────────────────────────────────────────────────────────────

function toDbReport(r: Report): DbReport {
  return {
    id:             r.id,
    session_id:     r.sessionId,
    session_title:  r.sessionTitle,
    submitted_at:   r.submittedAt,
    submitted_by:   r.submittedBy ?? null,
    attendees:      r.attendees,
    engagement:     r.engagement,
    highlights:     r.highlights,
    challenges:     r.challenges,
    notes:          r.notes,
    fidelity_score: r.fidelityScore ?? null,
  };
}

/**
 * Uploads all unsynced local reports to Supabase.
 * Returns the number of reports successfully synced.
 * Silently returns 0 when:
 *   - Supabase env vars are not configured
 *   - The browser is offline
 *   - All reports are already synced
 */
export async function syncPendingReports(): Promise<number> {
  const supabase = getSupabaseClient();
  if (!supabase) return 0;

  const pending = loadPendingReports();
  if (pending.length === 0) return 0;

  const { error } = await supabase
    .from("reports")
    .upsert(pending.map(toDbReport), { onConflict: "id" });

  if (error) {
    console.error("[sync] Supabase upsert failed:", error.message);
    return 0;
  }

  markReportsSynced(pending.map((r) => r.id));
  return pending.length;
}
