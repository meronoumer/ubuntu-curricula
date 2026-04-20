// Session fidelity tracking — CLIENT-ONLY (uses localStorage).
//
// Fidelity measures whether a facilitator completed steps as designed.
// This file keeps the feature lightweight and beginner-friendly.

export type SkipReason = "time" | "materials" | "not_relevant" | "other";

export type StepFidelityRecord = {
  stepIndex: number;
  stepTitle: string;
  required: boolean;
  completed: boolean;
  skipped: boolean;
  skipReason?: SkipReason;
  adaptationNote?: string;
  sensitiveDiscussion: boolean;
  startedAt: string;
  completedAt: string;
};

export type SessionFidelityRecord = {
  sessionId: string;
  steps: StepFidelityRecord[];
  fidelityScore: number;
  savedAt: string;
};

const STORAGE_PREFIX = "uf_fidelity_";

function storageKey(sessionId: string) {
  return `${STORAGE_PREFIX}${sessionId}`;
}

export function computeFidelityScore(records: StepFidelityRecord[]): number {
  if (records.length === 0) return 100;
  const completed = records.filter((record) => record.completed).length;
  return Math.round((completed / records.length) * 100);
}

export function fidelityLabel(score: number): "Poor" | "Fair" | "Good" {
  if (score >= 70) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

/**
 * Returns a Tailwind-friendly color class string for fidelity badges/cards.
 * This matches the import expected by SessionPlayer.tsx.
 */
export function fidelityColour(score: number): string {
  const label = fidelityLabel(score);

  if (label === "Good") {
    return "bg-green-100 text-green-700";
  }

  if (label === "Fair") {
    return "bg-yellow-100 text-yellow-800";
  }

  return "bg-red-100 text-red-700";
}

/**
 * Optional convenience helper if other parts of the UI want both label + simple color name.
 */
export function fidelityStatus(score: number) {
  const label = fidelityLabel(score);
  const color =
    label === "Good" ? "green" : label === "Fair" ? "yellow" : "red";

  return { label, color };
}

export function saveFidelity(
  sessionId: string,
  steps: StepFidelityRecord[]
): SessionFidelityRecord {
  const record: SessionFidelityRecord = {
    sessionId,
    steps,
    fidelityScore: computeFidelityScore(steps),
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(storageKey(sessionId), JSON.stringify(record));
  } catch {
    // localStorage may not be available in some environments.
  }

  return record;
}

export function loadFidelity(sessionId: string): SessionFidelityRecord | null {
  try {
    const raw = localStorage.getItem(storageKey(sessionId));
    if (!raw) return null;
    return JSON.parse(raw) as SessionFidelityRecord;
  } catch {
    return null;
  }
}

export function clearFidelity(sessionId: string): void {
  try {
    localStorage.removeItem(storageKey(sessionId));
  } catch {
    // ignore localStorage errors
  }
}