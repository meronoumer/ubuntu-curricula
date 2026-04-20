"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session, Step, StepType } from "@/app/_lib/mock-data";
import { getSupabaseClient } from "@/app/_lib/supabase";
import {
  saveFidelity,
  computeFidelityScore,
  fidelityLabel,
  fidelityColour,
  type StepFidelityRecord,
} from "@/app/_lib/fidelity";
import StepConfirmation, { type StepOutcome } from "./StepConfirmation";

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "uf_session_progress";

type ProgressStore = Record<string, { highestStep: number }>;

function loadProgress(sessionId: string): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const store: ProgressStore = JSON.parse(raw);
    return store[sessionId]?.highestStep ?? 0;
  } catch {
    return 0;
  }
}

function saveProgress(sessionId: string, highestStep: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const store: ProgressStore = raw ? JSON.parse(raw) : {};
    store[sessionId] = { highestStep };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable — silently degrade
  }
}

// ─── Step type badge ──────────────────────────────────────────────────────────

const TYPE_STYLES: Record<StepType, { bg: string; label: string }> = {
  instruction: { bg: "bg-[#1F4D3A]/10 text-[#1F4D3A]",   label: "Instruction"  },
  activity:    { bg: "bg-[#D9B44A]/20 text-[#7A5C3E]",    label: "Activity"     },
  reflection:  { bg: "bg-[#EDE4D3] text-[#7A5C3E]",       label: "Reflection"   },
  discussion:  { bg: "bg-[#1F4D3A]/10 text-[#1F4D3A]",    label: "Discussion"   },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[#1F2937]/40">
        <span>Step {current + 1} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#EDE4D3]">
        <div
          className="h-1.5 rounded-full bg-[#1F4D3A] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StepTypeBadge({ type }: { type: StepType }) {
  const { bg, label } = TYPE_STYLES[type];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${bg}`}>
      {label}
    </span>
  );
}

function FacilitatorNote({ note }: { note: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#D9B44A]/40 bg-[#D9B44A]/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#7A5C3E]"
      >
        <span>Facilitator note</span>
        <span className="text-[#D9B44A]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <p className="px-4 pb-4 text-sm text-[#1F2937]/70 leading-relaxed">
          {note}
        </p>
      )}
    </div>
  );
}

// ─── Completion screen ────────────────────────────────────────────────────────

function CompletionScreen({
  session,
  fidelityScore,
  completedSteps,
  totalSteps,
}: {
  session: Session;
  fidelityScore: number;
  completedSteps: number;
  totalSteps: number;
}) {
  const { bg, text } = fidelityColour(fidelityScore);
  const label = fidelityLabel(fidelityScore);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center text-2xl text-[#1F4D3A]">
        ✓
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#1F2937]">Session complete!</h2>
        <p className="text-sm text-[#1F2937]/50">{session.title}</p>
      </div>

      {/* Fidelity score */}
      <div className="w-full max-w-xs rounded-2xl border border-[#EDE4D3] bg-white p-5 space-y-3 text-left">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
            Session fidelity
          </p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${bg} ${text}`}>
            {label}
          </span>
        </div>

        {/* Score bar */}
        <div className="space-y-1.5">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#1F2937]">{fidelityScore}%</span>
            <span className="text-xs text-[#1F2937]/40 pb-1">
              {completedSteps} of {totalSteps} steps
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#EDE4D3]">
            <div
              className="h-2 rounded-full bg-[#1F4D3A] transition-all duration-500"
              style={{ width: `${fidelityScore}%` }}
            />
          </div>
        </div>

        {completedSteps < totalSteps && (
          <p className="text-xs text-[#1F2937]/40">
            {totalSteps - completedSteps} step{totalSteps - completedSteps !== 1 ? "s" : ""} skipped
          </p>
        )}
      </div>

      <p className="max-w-xs text-sm text-[#1F2937]/50">
        Submit your attendance and engagement report before you leave.
      </p>

      <Link
        href={`/report?sessionId=${session.id}&fidelityScore=${fidelityScore}`}
        className="rounded-xl bg-[#1F4D3A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#173d2e] transition-colors"
      >
        Submit Report
      </Link>
      <Link href="/sessions" className="text-sm text-[#1F2937]/40 hover:text-[#1F2937]/70 transition-colors">
        Back to sessions
      </Link>
    </div>
  );
}

// ─── Start gate ───────────────────────────────────────────────────────────────

function StartGate({
  session,
  sessionDbId,
  onStart,
}: {
  session: Session;
  sessionDbId: string;
  onStart: () => void;
}) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStart() {
    setStarting(true);
    setError(null);

    const supabase = getSupabaseClient();
    if (supabase) {
      const { error: dbError } = await supabase
        .from("sessions")
        .update({ status: "in-progress", started_at: new Date().toISOString() })
        .eq("id", sessionDbId);

      if (dbError) {
        setError("Could not start session. Please try again.");
        setStarting(false);
        return;
      }
    }

    router.refresh();
    onStart();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="space-y-1">
        <Link
          href="/sessions"
          className="text-xs text-[#7A5C3E]/60 hover:text-[#7A5C3E] transition-colors"
        >
          ← Back to sessions
        </Link>
        <h1 className="text-lg font-semibold text-[#1F2937] mt-2 leading-snug">
          {session.title}
        </h1>
        <p className="text-sm text-[#1F2937]/50">
          {session.location} · {new Date(session.date).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric"
          })}
        </p>
      </div>

      <div className="rounded-xl border border-[#EDE4D3] bg-white px-5 py-4 text-left max-w-sm w-full space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
          Ready to begin?
        </p>
        <p className="text-sm text-[#1F2937]/60 leading-relaxed">
          This session has {session.totalSteps} steps. Starting will mark it as
          in-progress so your program manager can track live delivery.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleStart}
        disabled={starting}
        className="rounded-xl bg-[#1F4D3A] px-8 py-3 text-sm font-semibold text-white hover:bg-[#173d2e] transition-colors disabled:opacity-50"
      >
        {starting ? "Starting…" : "Start Session"}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  session: Session;
  steps: Step[];
  sessionDbId?: string;
  initialStatus?: "upcoming" | "in-progress" | "completed";
};

export default function SessionPlayer({ session, steps, sessionDbId, initialStatus }: Props) {
  const [currentStep, setCurrentStep]   = useState(0);
  const [highestStep, setHighestStep]   = useState(0);
  const [done, setDone]                 = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [showStartGate, setShowStartGate] = useState(
    initialStatus === "upcoming" && !!sessionDbId
  );

  // Fidelity tracking
  const [fidelityRecords, setFidelityRecords] = useState<StepFidelityRecord[]>([]);
  const [stepStartedAt, setStepStartedAt]     = useState(() => new Date().toISOString());
  const [finalScore, setFinalScore]           = useState<number>(100);
  const [completedCount, setCompletedCount]   = useState(0);

  // Restore progress from localStorage on first render
  useEffect(() => {
    const saved = loadProgress(session.id);
    setHighestStep(saved);
    setCurrentStep(saved);
    if (saved >= steps.length) setDone(true);
  }, [session.id, steps.length]);

  // Record when the current step became visible
  useEffect(() => {
    setStepStartedAt(new Date().toISOString());
  }, [currentStep]);

  // Called when facilitator clicks "Next Step →" or "Finish Session"
  function handleNextClick() {
    setConfirming(true);
  }

  // Called when StepConfirmation is submitted
  async function handleStepConfirmed(outcome: StepOutcome) {
    const record: StepFidelityRecord = {
      stepIndex:          currentStep,
      stepTitle:          steps[currentStep].title,
      required:           steps[currentStep].required !== false,
      completed:          outcome.completed,
      skipped:            !outcome.completed,
      skipReason:         outcome.skipReason,
      adaptationNote:     outcome.adaptationNote,
      sensitiveDiscussion: outcome.sensitiveDiscussion,
      startedAt:          stepStartedAt,
      completedAt:        new Date().toISOString(),
    };

    const newRecords = [...fidelityRecords, record];
    setFidelityRecords(newRecords);
    setConfirming(false);

    const nextStep = currentStep + 1;

    if (nextStep >= steps.length) {
      // All steps confirmed — compute and save fidelity
      const score    = computeFidelityScore(newRecords);
      const numDone  = newRecords.filter((r) => r.completed).length;
      saveFidelity(session.id, newRecords);
      setFinalScore(score);
      setCompletedCount(numDone);

      const newHighest = steps.length;
      setHighestStep(newHighest);
      saveProgress(session.id, newHighest);

      // Mark session completed in Supabase
      if (sessionDbId) {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase
            .from("sessions")
            .update({ status: "completed", completed_at: new Date().toISOString() })
            .eq("id", sessionDbId);
        }
      }

      setDone(true);
      return;
    }

    // Advance to next step
    const newHighest = Math.max(highestStep, nextStep);
    setHighestStep(newHighest);
    saveProgress(session.id, newHighest);
    setCurrentStep(nextStep);
  }

  function handleBack() {
    setConfirming(false);
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (showStartGate && sessionDbId) {
    return (
      <StartGate
        session={session}
        sessionDbId={sessionDbId}
        onStart={() => setShowStartGate(false)}
      />
    );
  }

  if (done) {
    return (
      <CompletionScreen
        session={session}
        fidelityScore={finalScore}
        completedSteps={completedCount}
        totalSteps={steps.length}
      />
    );
  }

  const step       = steps[currentStep];
  const canGoNext  = currentStep <= highestStep;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/sessions"
          className="text-xs text-[#7A5C3E]/60 hover:text-[#7A5C3E] transition-colors"
        >
          ← Back to sessions
        </Link>
        <h1 className="text-lg font-semibold text-[#1F2937] leading-snug">
          {session.title}
        </h1>
      </div>

      {/* Progress */}
      <ProgressBar current={currentStep} total={steps.length} />

      {/* Step card */}
      <div className="rounded-2xl bg-white border border-[#EDE4D3] p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-[#1F2937] text-base leading-snug">
            {step.title}
          </h2>
          <StepTypeBadge type={step.type} />
        </div>

        <p className="text-xs text-[#1F2937]/40">{step.durationMinutes} min</p>

        <p className="text-sm text-[#1F2937]/70 leading-relaxed whitespace-pre-line">
          {step.content}
        </p>
      </div>

      {/* Facilitator note */}
      {step.facilitatorNote && (
        <FacilitatorNote note={step.facilitatorNote} />
      )}

      {/* Navigation or fidelity confirmation */}
      {confirming ? (
        <StepConfirmation
          stepTitle={step.title}
          isLastStep={isLastStep}
          onConfirm={handleStepConfirmed}
          onCancel={() => setConfirming(false)}
        />
      ) : (
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1 rounded-xl border border-[#EDE4D3] px-4 py-3 text-sm font-medium text-[#1F2937]/60 disabled:opacity-30 hover:bg-[#EDE4D3]/50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNextClick}
            disabled={!canGoNext}
            className="flex-[2] rounded-xl bg-[#1F4D3A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-[#173d2e] transition-colors"
          >
            {isLastStep ? "Finish Session" : "Next Step →"}
          </button>
        </div>
      )}

      {/* Locked-step indicator */}
      {!confirming && currentStep > highestStep && (
        <p className="text-center text-xs text-[#1F2937]/40">
          Complete the previous step to unlock this one.
        </p>
      )}
    </div>
  );
}
