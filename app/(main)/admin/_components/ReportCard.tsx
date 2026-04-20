"use client";

import { useState } from "react";
import { fidelityColour } from "@/app/_lib/fidelity";

// Shared display shape — accepted by both the Supabase path and the local fallback
export type DisplayReport = {
  id: string;
  sessionTitle: string;
  submittedAt: string;
  submittedBy?: string;      // email of the facilitator; optional for backwards compat
  attendees: number;
  engagement: number;        // 1–5
  highlights: string;
  challenges: string;
  notes: string;
  fidelityScore?: number;    // 0–100; absent for reports submitted before fidelity tracking
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
      <p className="text-xs font-medium text-[#7A5C3E]/60 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-[#1F2937]/80 leading-relaxed">{value}</p>
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
    <div className="rounded-2xl bg-white border border-[#EDE4D3] overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-[#F8F4EC] transition-colors"
      >
        {/* Date */}
        <span className="text-xs text-[#1F2937]/40 shrink-0 w-28">
          {formatDate(report.submittedAt)}
        </span>

        {/* Facilitator */}
        {report.submittedBy && (
          <span className="text-xs text-[#7A5C3E] font-medium truncate max-w-[120px]">
            {report.submittedBy.split("@")[0]}
          </span>
        )}

        {/* Attendees */}
        <span className="text-sm font-medium text-[#1F2937] shrink-0 w-16">
          {report.attendees} ppl
        </span>

        {/* Engagement */}
        <Stars value={report.engagement} />

        {/* Fidelity badge */}
        {report.fidelityScore !== undefined && (() => {
          const { bg, text } = fidelityColour(report.fidelityScore);
          return (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${bg} ${text}`}>
              {report.fidelityScore}%
            </span>
          );
        })()}

        {/* Sync badge */}
        {report.synced !== undefined && (
          <span
            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              report.synced
                ? "bg-[#1F4D3A]/10 text-[#1F4D3A]"
                : "bg-[#D9B44A]/10 text-[#7A5C3E]"
            }`}
          >
            {report.synced ? "Synced" : "Pending"}
          </span>
        )}

        {/* Chevron */}
        <span className="ml-auto shrink-0 text-[#1F2937]/20 text-xs">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#EDE4D3] px-4 py-4 space-y-4">
          {report.submittedBy && (
            <DetailRow label="Submitted by" value={report.submittedBy} />
          )}
          <DetailRow label="Highlights" value={report.highlights} />
          <DetailRow label="Challenges" value={report.challenges} />
          {report.notes && <DetailRow label="Notes" value={report.notes} />}
        </div>
      )}
    </div>
  );
}
