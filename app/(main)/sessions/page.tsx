import { MOCK_SESSIONS, MOCK_STEPS } from "@/app/_lib/mock-data";
import { getSupabaseServerClient, fetchSessions } from "@/app/_lib/supabase-server";
import type { DbSession } from "@/app/_lib/supabase";
import type { CachedSession } from "@/app/_lib/session-cache";
import SessionsDisplay from "./_components/SessionsDisplay";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function normalizeStatus(
  status: string | null | undefined
): CachedSession["status"] {
  if (status === "in-progress") return "in-progress";
  if (status === "completed") return "completed";
  return "upcoming";
}

function getAssignedEmail(session: DbSession): string {
  const raw = session as DbSession & {
    facilitator_email?: string | null;
    assigned_to?: string | null;
  };

  return normalizeEmail(raw.assigned_to ?? raw.facilitator_email ?? "");
}

function fromDb(s: DbSession): CachedSession {
  const raw = s as DbSession & {
    facilitator_email?: string | null;
    assigned_to?: string | null;
    template_id?: string | null;
  };

  const steps = raw.template_id ? (MOCK_STEPS[raw.template_id] ?? []) : [];

  return {
    id: s.id,
    title: s.title,
    description: s.description ?? "No description provided yet.",
    date: s.date,
    location: s.location ?? "Location not set",
    assignedTo: raw.assigned_to ?? raw.facilitator_email ?? "Unassigned",
    status: normalizeStatus(s.status),
    totalSteps: steps.length,
  };
}

function fromMockSession(s: (typeof MOCK_SESSIONS)[number]): CachedSession {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    date: s.date,
    location: s.location,
    assignedTo: s.facilitator,
    status: s.status,
    totalSteps: s.totalSteps,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// Server component: fetches sessions from Supabase and passes them to the
// client component SessionsDisplay, which handles caching and offline fallback.

export default async function SessionsPage() {
  let sessions: CachedSession[] = [];

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userEmail = normalizeEmail(user?.email);
    const isAdmin = user?.user_metadata?.role === "admin";

    const dbSessions = await fetchSessions();

    if (dbSessions !== null) {
      const filtered = isAdmin
        ? dbSessions
        : dbSessions.filter((s) => getAssignedEmail(s) === userEmail);

      if (filtered.length > 0) {
        sessions = filtered.map(fromDb);
      } else {
        // Supabase returned no sessions matching this user — fall back to mock data.
        sessions = MOCK_SESSIONS.map(fromMockSession);
      }
    } else {
      // Supabase query failed — fall back to mock data.
      sessions = MOCK_SESSIONS.map(fromMockSession);
    }
  } else {
    // Supabase not configured — use mock data (demo mode).
    sessions = MOCK_SESSIONS.map(fromMockSession);
  }

  return <SessionsDisplay initialSessions={sessions} />;
}