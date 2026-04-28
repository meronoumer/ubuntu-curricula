import { MOCK_SESSIONS } from "@/app/_lib/mock-data";
import { fetchSessions } from "@/app/_lib/supabase-server";
import type { DbSession } from "@/app/_lib/supabase";
import type { Session } from "@/app/_lib/mock-data";
import ReportForm from "./_components/ReportForm";

function normalizeStatus(
  status: string | null | undefined
): Session["status"] {
  if (status === "in-progress") return "in-progress";
  if (status === "completed") return "completed";
  return "upcoming";
}

function dbToSession(s: DbSession): Session {
  return {
    id: s.id,
    title: s.title,
    description: s.description ?? "No description provided yet.",
    date: s.date,
    location: s.location ?? "Location not set",
    facilitator: s.assigned_to ?? s.facilitator_email ?? "Unassigned",
    status: normalizeStatus(s.status),
    totalSteps: 0, // Report page only needs identity/title; step count isn't critical here
  };
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string; fidelityScore?: string }>;
}) {
  const { sessionId, fidelityScore } = await searchParams;

  // Try real sessions first
  const dbSessions = await fetchSessions();
  const realSessions = dbSessions ? dbSessions.map(dbToSession) : [];

  // If real sessions exist, use them; otherwise fall back to mock sessions
  const sessions = realSessions.length > 0 ? realSessions : MOCK_SESSIONS;

  // Preselect if the incoming sessionId exists in whichever session list we are using
  const preselected =
    sessions.some((s) => s.id === sessionId) ? (sessionId ?? null) : null;

  // Parse fidelity score from the URL
  const parsedFidelityScore =
    fidelityScore !== undefined ? parseInt(fidelityScore, 10) : undefined;

  return (
    <ReportForm
      sessions={sessions}
      preselectedSessionId={preselected}
      fidelityScore={
        parsedFidelityScore !== undefined && !isNaN(parsedFidelityScore)
          ? parsedFidelityScore
          : undefined
      }
    />
  );
  
}  