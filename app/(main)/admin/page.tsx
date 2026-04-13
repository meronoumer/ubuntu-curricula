import { redirect } from "next/navigation";
import { type DbReport } from "@/app/_lib/supabase";
import { getSupabaseServerClient } from "@/app/_lib/supabase-server";
import StatsBar from "./_components/StatsBar";
import ReportCard, { type DisplayReport } from "./_components/ReportCard";
import LocalReportsFallback from "./_components/LocalReportsFallback";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchReports(): Promise<DbReport[] | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[admin] Supabase fetch failed:", error.message);
    return null;
  }

  return data as DbReport[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDisplay(r: DbReport): DisplayReport {
  return {
    id: r.id,
    sessionTitle: r.session_title,
    submittedAt: r.submitted_at,
    attendees: r.attendees,
    engagement: r.engagement,
    highlights: r.highlights,
    challenges: r.challenges,
    notes: r.notes,
  };
}

function groupBySession(reports: DbReport[]): Map<string, DbReport[]> {
  const map = new Map<string, DbReport[]>();
  for (const r of reports) {
    if (!map.has(r.session_title)) map.set(r.session_title, []);
    map.get(r.session_title)!.push(r);
  }
  return map;
}

// Per-session summary stats shown under each section heading
function sessionSummary(group: DbReport[]) {
  const totalAttendees = group.reduce((s, r) => s + r.attendees, 0);
  const avgEngagement = (
    group.reduce((s, r) => s + r.engagement, 0) / group.length
  ).toFixed(1);
  const latest = new Date(
    Math.max(...group.map((r) => new Date(r.submitted_at).getTime()))
  ).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return { totalAttendees, avgEngagement, latest };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  // Defense-in-depth: proxy already redirects non-admins, but we double-check
  // here so the page never renders sensitive data if the proxy is bypassed.
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== "admin") {
      redirect("/sessions");
    }
  }

  const reports = await fetchReports();

  // Supabase not configured — fall back to localStorage view
  if (reports === null) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-[#1F2937]">Admin Dashboard</h1>
        <LocalReportsFallback />
      </div>
    );
  }

  const grouped = groupBySession(reports);

  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#7A5C3E] mb-1">
            Ubuntu Curriculum
          </p>
          <h1 className="text-2xl font-semibold text-[#1F2937]">
            Admin Dashboard
          </h1>
        </div>
        <span className="text-xs text-[#1F2937]/40 bg-[#EDE4D3] px-3 py-1.5 rounded-full">
          Live · Supabase
        </span>
      </div>

      {/* ── Summary stats + engagement breakdown ────────────────────────── */}
      <StatsBar reports={reports} />

      {/* ── Reports by session ──────────────────────────────────────────── */}
      {reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#EDE4D3] p-12 text-center">
          <p className="text-[#1F2937]/40 text-sm">
            No reports submitted yet. They will appear here as facilitators submit them.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#7A5C3E] mb-4">
              Results by session — {grouped.size} session{grouped.size !== 1 ? "s" : ""}
            </p>
          </div>

          {Array.from(grouped).map(([sessionTitle, group]) => {
            const { totalAttendees, avgEngagement, latest } = sessionSummary(group);
            return (
              <section key={sessionTitle} className="space-y-3">

                {/* Session header with mini-stats */}
                <div className="bg-[#EDE4D3] rounded-xl px-4 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-sm font-semibold text-[#1F2937]">
                      {sessionTitle}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-xs text-[#1F2937]/60">
                      <span>
                        <span className="font-medium text-[#1F2937]">{group.length}</span>
                        {" "}report{group.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        <span className="font-medium text-[#1F2937]">{totalAttendees}</span>
                        {" "}attendees
                      </span>
                      <span>
                        <span className="font-medium text-[#1F2937]">⌀ {avgEngagement}</span>
                        {" "}engagement
                      </span>
                      <span>Last: {latest}</span>
                    </div>
                  </div>
                </div>

                {/* Individual report cards */}
                <div className="space-y-2 pl-1">
                  {group.map((r) => (
                    <ReportCard key={r.id} report={toDisplay(r)} />
                  ))}
                </div>

              </section>
            );
          })}
        </div>
      )}

      {/* ── Facilitator tracking note ────────────────────────────────────── */}
      <div className="rounded-xl border border-[#EDE4D3] bg-white px-4 py-4">
        <p className="text-xs font-semibold text-[#7A5C3E] uppercase tracking-wide mb-1">
          Coming next: per-facilitator summaries
        </p>
        <p className="text-sm text-[#1F2937]/60 leading-relaxed">
          Reports are currently grouped by session. To also group by facilitator,
          add a <code className="bg-[#EDE4D3] px-1 rounded text-xs">submitted_by</code> column
          (text, stores the facilitator&apos;s email) to the{" "}
          <code className="bg-[#EDE4D3] px-1 rounded text-xs">reports</code> table in Supabase,
          then capture it in the report form on submit.
        </p>
      </div>

    </div>
  );
}
