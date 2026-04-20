"use client";

import { useState } from "react";
import type { SkipReason } from "@/app/_lib/fidelity";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StepOutcome = {
  completed: boolean;
  skipReason?: SkipReason;
  adaptationNote?: string;
  sensitiveDiscussion: boolean;
};

type Props = {
  stepTitle: string;
  isLastStep: boolean;
  onConfirm: (outcome: StepOutcome) => void;
  onCancel: () => void;
};

// ─── Skip reason options ──────────────────────────────────────────────────────

const SKIP_REASONS: { value: SkipReason; label: string }[] = [
  { value: "time",         label: "Ran out of time" },
  { value: "materials",    label: "Missing materials" },
  { value: "not_relevant", label: "Not relevant today" },
  { value: "other",        label: "Other" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function StepConfirmation({
  stepTitle,
  isLastStep,
  onConfirm,
  onCancel,
}: Props) {
  const [status, setStatus]   = useState<"done" | "skip" | null>(null);
  const [skipReason, setSkipReason] = useState<SkipReason | null>(null);
  const [sensitive, setSensitive]   = useState(false);
  const [showNote, setShowNote]     = useState(false);
  const [note, setNote]             = useState("");

  // The "Continue" button is enabled only once a status is chosen
  // (and, if skipping, a reason is also chosen).
  const canContinue =
    status === "done" ||
    (status === "skip" && skipReason !== null);

  function handleContinue() {
    if (!canContinue) return;
    onConfirm({
      completed: status === "done",
      skipReason: status === "skip" ? (skipReason ?? undefined) : undefined,
      adaptationNote: note.trim() || undefined,
      sensitiveDiscussion: sensitive,
    });
  }

  return (
    <div className="rounded-2xl border border-[#EDE4D3] bg-[#F8F4EC] p-4 space-y-4">

      {/* Heading */}
      <div className="space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
          How did this step go?
        </p>
        <p className="text-xs text-[#1F2937]/40 line-clamp-1">{stepTitle}</p>
      </div>

      {/* Done / Skip — big tap targets */}
      <div className="flex gap-3">
        <button
          onClick={() => { setStatus("done"); setSkipReason(null); }}
          className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
            status === "done"
              ? "bg-[#1F4D3A] border-[#1F4D3A] text-white"
              : "bg-white border-[#EDE4D3] text-[#1F2937]/70 hover:border-[#1F4D3A]/40"
          }`}
        >
          ✓ Done
        </button>
        <button
          onClick={() => setStatus("skip")}
          className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all ${
            status === "skip"
              ? "bg-[#7A5C3E] border-[#7A5C3E] text-white"
              : "bg-white border-[#EDE4D3] text-[#1F2937]/70 hover:border-[#7A5C3E]/40"
          }`}
        >
          ✗ Skip
        </button>
      </div>

      {/* Skip reasons — only shown when Skip is selected */}
      {status === "skip" && (
        <div className="space-y-2">
          <p className="text-xs text-[#1F2937]/50">Why was it skipped?</p>
          <div className="grid grid-cols-2 gap-2">
            {SKIP_REASONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSkipReason(value)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${
                  skipReason === value
                    ? "bg-[#7A5C3E] border-[#7A5C3E] text-white"
                    : "bg-white border-[#EDE4D3] text-[#1F2937]/60 hover:border-[#7A5C3E]/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sensitive discussion toggle — always visible */}
      <button
        onClick={() => setSensitive((s) => !s)}
        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
          sensitive
            ? "border-[#D9B44A]/60 bg-[#D9B44A]/10 text-[#7A5C3E]"
            : "border-[#EDE4D3] bg-white text-[#1F2937]/50 hover:border-[#D9B44A]/30"
        }`}
      >
        <span className="font-medium">Sensitive topic came up</span>
        <span className={`w-9 h-5 rounded-full border-2 flex items-center transition-all ${
          sensitive ? "border-[#D9B44A] bg-[#D9B44A]" : "border-[#EDE4D3] bg-white"
        }`}>
          <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all mx-auto ${
            sensitive ? "translate-x-2" : "-translate-x-1.5"
          }`} />
        </span>
      </button>

      {/* Optional adaptation note */}
      {!showNote ? (
        <button
          onClick={() => setShowNote(true)}
          className="text-xs text-[#7A5C3E]/60 hover:text-[#7A5C3E] transition-colors"
        >
          + Add adaptation note
        </button>
      ) : (
        <div className="space-y-1">
          <label className="text-xs text-[#1F2937]/40">Adaptation note (optional)</label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Shortened activity due to late start…"
            className="w-full rounded-xl border border-[#EDE4D3] bg-white px-3 py-2 text-xs text-[#1F2937] placeholder:text-[#1F2937]/25 focus:border-[#1F4D3A] focus:outline-none resize-none"
          />
        </div>
      )}

      {/* Footer: Cancel + Continue */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onCancel}
          className="text-xs text-[#1F2937]/40 hover:text-[#1F2937]/70 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="rounded-xl bg-[#1F4D3A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#173d2e] disabled:opacity-30"
        >
          {isLastStep ? "Finish Session" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
