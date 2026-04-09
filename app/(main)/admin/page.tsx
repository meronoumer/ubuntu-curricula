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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  // Defense-in-depth: the proxy already redirects non-admins, but we
  // double-check here so the page is safe even if the proxy is bypassed.
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

  // Supabase not configured — hand off to the client-side localStorage fallback
  if (reports === null) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <LocalReportsFallback />
      </div>
    );
  }

  const grouped = groupBySession(reports);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <span className="text-xs text-gray-400">Live from Supabase</span>
      </div>

      {/* Summary */}
      <StatsBar reports={reports} />

      {/* Reports by session */}
      {reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
          No reports submitted yet.
        </div>
      ) : (
        Array.from(grouped).map(([sessionTitle, group]) => (
          <section key={sessionTitle} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {sessionTitle}
            </h2>
            {group.map((r) => (
              <ReportCard key={r.id} report={toDisplay(r)} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}
