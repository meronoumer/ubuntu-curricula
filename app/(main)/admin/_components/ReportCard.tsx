"use client";

import { useState } from "react";

// Shared display shape — accepted by both the Supabase path and the local fallback
export type DisplayReport = {
  id: string;
  sessionTitle: string;
  submittedAt: string;
  attendees: number;
  engagement: number;    // 1–5
  highlights: string;
  challenges: string;
  notes: string;
  synced?: boolean;
};

function Stars({ value }: { value: number }) {
  return (
    <span className="text-sm" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "text-amber-400" : "text-gray-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportCard({ report }: { report: DisplayReport }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Date */}
        <span className="text-xs text-gray-400 shrink-0 w-28">
          {formatDate(report.submittedAt)}
        </span>

        {/* Attendees */}
        <span className="text-sm font-medium text-gray-700 shrink-0 w-16">
          {report.attendees} ppl
        </span>

        {/* Engagement */}
        <Stars value={report.engagement} />

        {/* Sync badge */}
        {report.synced !== undefined && (
          <span
            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              report.synced
                ? "bg-green-50 text-green-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {report.synced ? "Synced" : "Pending"}
          </span>
        )}

        {/* Chevron */}
        <span className="ml-auto shrink-0 text-gray-300 text-xs">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-4">
          <DetailRow label="Highlights" value={report.highlights} />
          <DetailRow label="Challenges" value={report.challenges} />
          {report.notes && <DetailRow label="Notes" value={report.notes} />}
        </div>
      )}
    </div>
  );
}
