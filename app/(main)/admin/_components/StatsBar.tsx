import type { DbReport } from "@/app/_lib/supabase";

type Props = { reports: DbReport[] };

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-400 text-center">{label}</span>
    </div>
  );
}

export default function StatsBar({ reports }: Props) {
  const totalAttendees = reports.reduce((sum, r) => sum + r.attendees, 0);
  const avgEngagement =
    reports.length === 0
      ? "—"
      : (reports.reduce((sum, r) => sum + r.engagement, 0) / reports.length).toFixed(1);
  const sessions = new Set(reports.map((r) => r.session_id)).size;

  return (
    <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
      <Stat label="Reports" value={reports.length} />
      <Stat label="Attendees" value={totalAttendees} />
      <Stat label="Avg engagement" value={avgEngagement} />
      <Stat label="Sessions" value={sessions} />
    </div>
  );
}
