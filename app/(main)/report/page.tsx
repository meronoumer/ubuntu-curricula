import { MOCK_SESSIONS } from "@/app/_lib/mock-data";
import ReportForm from "./_components/ReportForm";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { sessionId } = await searchParams;

  // Only pre-select if the id actually exists in our data
  const preselected =
    MOCK_SESSIONS.some((s) => s.id === sessionId) ? (sessionId ?? null) : null;

  return <ReportForm sessions={MOCK_SESSIONS} preselectedSessionId={preselected} />;
}
