import { notFound } from "next/navigation";
import { MOCK_SESSIONS, MOCK_STEPS } from "@/app/_lib/mock-data";
import SessionPlayer from "./_components/SessionPlayer";

export default async function SessionPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = MOCK_SESSIONS.find((s) => s.id === id);
  const steps = MOCK_STEPS[id];

  if (!session || !steps) notFound();

  return <SessionPlayer session={session} steps={steps} />;
}
