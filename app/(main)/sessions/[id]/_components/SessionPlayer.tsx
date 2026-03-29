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
  instruction: { bg: "bg-blue-100 text-blue-700",   label: "Instruction"  },
  activity:    { bg: "bg-violet-100 text-violet-700", label: "Activity"    },
  reflection:  { bg: "bg-amber-100 text-amber-700",  label: "Reflection"  },
  discussion:  { bg: "bg-teal-100 text-teal-700",    label: "Discussion"  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>Step {current + 1} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-indigo-500 transition-all duration-300"
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
    <div className="rounded-xl border border-amber-200 bg-amber-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-amber-800"
      >
        <span>Facilitator note</span>
        <span className="text-amber-500">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <p className="px-4 pb-4 text-sm text-amber-900 leading-relaxed">
          {note}
        </p>
      )}
    </div>
  );
}

function CompletionScreen({ session }: { session: Session }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="text-5xl">✓</div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-gray-900">Session complete!</h2>
        <p className="text-sm text-gray-500">{session.title}</p>
      </div>
      <p className="max-w-xs text-sm text-gray-500">
        All {session.totalSteps} steps finished. Submit your attendance and
        engagement report before you leave.
      </p>
      <Link
        href={`/report?sessionId=${session.id}`}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Submit Report
      </Link>
      <Link href="/sessions" className="text-sm text-gray-400 hover:text-gray-600">
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
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          ← Back to sessions
        </Link>
        <h1 className="text-lg font-bold text-gray-900 leading-snug">
          {session.title}
        </h1>
      </div>

      {/* Progress */}
      <ProgressBar current={currentStep} total={steps.length} />

      {/* Step card */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-gray-900 text-base leading-snug">
            {step.title}
          </h2>
          <StepTypeBadge type={step.type} />
        </div>

        <p className="text-xs text-gray-400">{step.durationMinutes} min</p>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex-[2] rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40 hover:bg-indigo-700 transition-colors"
        >
          {isLastStep ? "Finish Session" : "Next Step →"}
        </button>
      </div>

      {/* Locked-step indicator */}
      {currentStep > highestStep && (
        <p className="text-center text-xs text-gray-400">
          Complete the previous step to unlock this one.
        </p>
      )}
    </div>
  );
}
