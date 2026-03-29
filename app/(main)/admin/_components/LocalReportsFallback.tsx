"use client";

import { useEffect, useState } from "react";
import { loadReports, type Report } from "@/app/_lib/reports";
import ReportCard, { type DisplayReport } from "./ReportCard";

function toDisplay(r: Report): DisplayReport {
  return {
    id: r.id,
    sessionTitle: r.sessionTitle,
    submittedAt: r.submittedAt,
    attendees: r.attendees,
    engagement: r.engagement,
    highlights: r.highlights,
    challenges: r.challenges,
    notes: r.notes,
    synced: r.synced,
  };
}

function groupBySession(reports: Report[]): Map<string, Report[]> {
  const map = new Map<string, Report[]>();
  for (const r of reports) {
    const key = r.sessionTitle;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return map;
}

export default function LocalReportsFallback() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // localStorage is only available after hydration
    const all = loadReports().sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    setReports(all);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      {/* No-Supabase notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Supabase not configured.</strong> Showing locally stored reports only.
        Add <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">
          NEXT_PUBLIC_SUPABASE_URL
        </code> and{" "}
        <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        to <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">.env.local</code> to enable sync.
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
          No reports submitted yet.
        </div>
      ) : (
        Array.from(groupBySession(reports)).map(([sessionTitle, group]) => (
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
