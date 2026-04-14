"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session, Step, StepType } from "@/app/_lib/mock-data";

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

function CompletionScreen({ session }: { session: Session }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center text-2xl text-[#1F4D3A]">
        ✓
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#1F2937]">Session complete!</h2>
        <p className="text-sm text-[#1F2937]/50">{session.title}</p>
      </div>
      <p className="max-w-xs text-sm text-[#1F2937]/50">
        All {session.totalSteps} steps finished. Submit your attendance and
        engagement report before you leave.
      </p>
      <Link
        href={`/report?sessionId=${session.id}`}
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

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  session: Session;
  steps: Step[];
};

export default function SessionPlayer({ session, steps }: Props) {
  // Index of the step currently on screen
  const [currentStep, setCurrentStep] = useState(0);
  // Furthest step the facilitator has unlocked (0-indexed)
  const [highestStep, setHighestStep] = useState(0);
  // Whether the completion screen is showing
  const [done, setDone] = useState(false);

  // Restore progress from localStorage on first render
  useEffect(() => {
    const saved = loadProgress(session.id);
    setHighestStep(saved);
    setCurrentStep(saved);
    // If they previously finished all steps, go straight to done
    if (saved >= steps.length) setDone(true);
  }, [session.id, steps.length]);

  function handleNext() {
    const nextStep = currentStep + 1;

    if (nextStep >= steps.length) {
      // All steps done
      const newHighest = steps.length; // sentinel value: "finished"
      setHighestStep(newHighest);
      saveProgress(session.id, newHighest);
      setDone(true);
      return;
    }

    // Advance the unlock frontier only when moving past the edge
    const newHighest = Math.max(highestStep, nextStep);
    setHighestStep(newHighest);
    saveProgress(session.id, newHighest);
    setCurrentStep(nextStep);
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  if (done) {
    return <CompletionScreen session={session} />;
  }

  const step = steps[currentStep];
  // Can only go forward to steps the facilitator has already unlocked
  const canGoNext = currentStep <= highestStep;
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

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex-1 rounded-xl border border-[#EDE4D3] px-4 py-3 text-sm font-medium text-[#1F2937]/60 disabled:opacity-30 hover:bg-[#EDE4D3]/50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex-[2] rounded-xl bg-[#1F4D3A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-[#173d2e] transition-colors"
        >
          {isLastStep ? "Finish Session" : "Next Step →"}
        </button>
      </div>

      {/* Locked-step indicator */}
      {currentStep > highestStep && (
        <p className="text-center text-xs text-[#1F2937]/40">
          Complete the previous step to unlock this one.
        </p>
      )}
    </div>
  );
}
