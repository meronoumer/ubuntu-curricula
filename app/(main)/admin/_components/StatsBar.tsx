import type { DbReport } from "@/app/_lib/supabase";

type Props = { reports: DbReport[] };

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#EDE4D3] p-4 space-y-1">
      <p className="text-xs font-medium text-[#7A5C3E] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#1F2937]">{value}</p>
      {sub && <p className="text-xs text-[#1F2937]/50">{sub}</p>}
    </div>
  );
}

export default function StatsBar({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#EDE4D3] p-6 text-center text-sm text-[#1F2937]/40">
        No reports submitted yet. Stats will appear here once data comes in.
      </div>
    );
  }

  const totalAttendees = reports.reduce((sum, r) => sum + r.attendees, 0);
  const avgEngagement =
    (reports.reduce((sum, r) => sum + r.engagement, 0) / reports.length).toFixed(1);
  const uniqueSessions = new Set(reports.map((r) => r.session_id)).size;

  // Best session: highest average engagement across its reports
  const bySession = new Map<string, number[]>();
  for (const r of reports) {
    if (!bySession.has(r.session_title)) bySession.set(r.session_title, []);
    bySession.get(r.session_title)!.push(r.engagement);
  }
  let bestSession = "—";
  let bestAvg = 0;
  bySession.forEach((scores, title) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > bestAvg) { bestAvg = avg; bestSession = title; }
  });

  // Engagement distribution: how many reports at each rating
  const dist = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: reports.filter((r) => r.engagement === score).length,
  }));
  const maxCount = Math.max(...dist.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Reports" value={reports.length} sub="total submitted" />
        <StatCard label="Attendees" value={totalAttendees} sub="across all sessions" />
        <StatCard
          label="Avg engagement"
          value={`${avgEngagement} / 5`}
          sub={`across ${reports.length} reports`}
        />
        <StatCard label="Sessions" value={uniqueSessions} sub="unique modules run" />
      </div>

      {/* Best session highlight */}
      {bestSession !== "—" && (
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: "#1F4D3A" }}
        >
          <span className="text-[#D9B44A] text-lg">★</span>
          <div>
            <p className="text-xs font-medium text-[#D9B44A] uppercase tracking-wide">
              Highest engagement
            </p>
            <p className="text-sm font-semibold text-white">
              {bestSession}
              <span className="ml-2 text-white/60 font-normal">
                ⌀ {bestAvg.toFixed(1)} / 5
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Engagement distribution */}
      <div className="bg-white rounded-xl border border-[#EDE4D3] p-4">
        <p className="text-xs font-medium text-[#7A5C3E] uppercase tracking-wide mb-3">
          Engagement breakdown
        </p>
        <div className="space-y-2">
          {dist.map(({ score, count }) => (
            <div key={score} className="flex items-center gap-3">
              <span className="text-xs text-[#1F2937]/50 w-8 text-right shrink-0">
                {score}★
              </span>
              <div className="flex-1 bg-[#EDE4D3] rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: score >= 4 ? "#1F4D3A" : score === 3 ? "#D9B44A" : "#7A5C3E",
                  }}
                />
              </div>
              <span className="text-xs text-[#1F2937]/50 w-6 shrink-0">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
