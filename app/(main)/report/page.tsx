import { MOCK_SESSIONS } from "@/app/_lib/mock-data";
import ReportForm from "./_components/ReportForm";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string; fidelityScore?: string }>;
}) {
  const { sessionId, fidelityScore } = await searchParams;

  // Pre-select the session if it's in mock data.
  // Real Supabase sessions have UUID ids — they won't match here,
  // so the facilitator can select the session manually from the dropdown.
  const preselected =
    MOCK_SESSIONS.some((s) => s.id === sessionId) ? (sessionId ?? null) : null;

  // Parse the fidelity score from the URL (set by SessionPlayer on completion).
  const parsedFidelityScore =
    fidelityScore !== undefined ? parseInt(fidelityScore, 10) : undefined;

  return (
    <ReportForm
      sessions={MOCK_SESSIONS}
      preselectedSessionId={preselected}
      fidelityScore={
        parsedFidelityScore !== undefined && !isNaN(parsedFidelityScore)
          ? parsedFidelityScore
          : undefined
      }
    />
  );
}
