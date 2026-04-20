"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@/app/_lib/mock-data";
import { saveReport, syncPendingReports } from "@/app/_lib/reports";
import { getSupabaseClient } from "@/app/_lib/supabase";
import { fidelityLabel, fidelityColour } from "@/app/_lib/fidelity";
// ─── Engagement star picker ───────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl leading-none transition-transform hover:scale-110"
            aria-label={`${n} star${n !== 1 ? "s" : ""}`}
          >
            {n <= (hovered || value) ? "★" : "☆"}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#7A5C3E]/60 h-4">
        {labels[hovered || value]}
      </p>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#1F2937]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-[#1F2937]/40">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#EDE4D3] bg-white px-3 py-2.5 text-sm text-[#1F2937] placeholder:text-[#1F2937]/25 focus:border-[#1F4D3A] focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/10 transition";

const textareaClass = inputClass + " resize-none";

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  sessionTitle,
  onAnother,
}: {
  sessionTitle: string;
  onAnother: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F4D3A]/10 text-2xl text-[#1F4D3A]">
        ✓
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[#1F2937]">Report submitted!</h2>
        <p className="text-sm text-[#1F2937]/50 max-w-xs">
          Your report for <span className="font-medium text-[#1F2937]">{sessionTitle}</span> has
          been saved locally and will sync when you are back online.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <a
          href="/sessions"
          className="rounded-xl bg-[#1F4D3A] px-4 py-3 text-sm font-semibold text-white text-center hover:bg-[#173d2e] transition-colors"
        >
          Back to sessions
        </a>
        <button
          onClick={onAnother}
          className="rounded-xl border border-[#EDE4D3] px-4 py-3 text-sm font-medium text-[#7A5C3E] hover:bg-[#EDE4D3]/50 transition-colors"
        >
          Submit another report
        </button>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

type Props = {
  sessions: Session[];
  preselectedSessionId: string | null;
  fidelityScore?: number;   // passed from session player via URL param
};

type FormState = {
  sessionId: string;
  attendees: string;
  engagement: number;
  highlights: string;
  challenges: string;
  notes: string;
};

const EMPTY_FORM = (sessionId = ""): FormState => ({
  sessionId,
  attendees: "",
  engagement: 0,
  highlights: "",
  challenges: "",
  notes: "",
});

export default function ReportForm({ sessions, preselectedSessionId, fidelityScore }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    EMPTY_FORM(preselectedSessionId ?? "")
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [submittedTitle, setSubmittedTitle] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.sessionId) next.sessionId = "Select a session.";
    const count = parseInt(form.attendees, 10);
    if (!form.attendees || isNaN(count) || count < 0)
      next.attendees = "Enter a valid attendee count (0 or more).";
    if (form.engagement === 0) next.engagement = "Rate the engagement level.";
    if (!form.highlights.trim()) next.highlights = "Required.";
    if (!form.challenges.trim()) next.challenges = "Required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Identify the logged-in facilitator so the report is attributable
    const supabase = getSupabaseClient();
    const submittedBy =
      supabase ? (await supabase.auth.getUser()).data.user?.email ?? "" : "";

    const session = sessions.find((s) => s.id === form.sessionId)!;
    saveReport({
      sessionId: form.sessionId,
      sessionTitle: session.title,
      submittedBy,
      attendees: parseInt(form.attendees, 10),
      engagement: form.engagement,
      highlights: form.highlights.trim(),
      challenges: form.challenges.trim(),
      notes: form.notes.trim(),
      fidelityScore,
    });

    syncPendingReports();

    setSubmittedTitle(session.title);
  }

  if (submittedTitle) {
    return (
      <SuccessScreen
        sessionTitle={submittedTitle}
        onAnother={() => {
          setSubmittedTitle(null);
          setForm(EMPTY_FORM());
          setErrors({});
          router.replace("/report");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1F2937]">Submit Report</h1>
        <p className="mt-1 text-sm text-[#1F2937]/50">
          Record attendance, engagement, and notes for your session.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[#EDE4D3] p-5 space-y-5">

        {/* Session selector */}
        <Field label="Session" required>
          <select
            value={form.sessionId}
            onChange={(e) => set("sessionId", e.target.value)}
            className={inputClass}
          >
            <option value="">— Select a session —</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          {errors.sessionId && (
            <p className="text-xs text-red-500 mt-1">{errors.sessionId}</p>
          )}
        </Field>

        {/* Attendees */}
        <Field
          label="Attendees"
          required
          hint="Number of participants who attended"
        >
          <input
            type="number"
            min={0}
            value={form.attendees}
            onChange={(e) => set("attendees", e.target.value)}
            placeholder="e.g. 14"
            className={inputClass}
          />
          {errors.attendees && (
            <p className="text-xs text-red-500 mt-1">{errors.attendees}</p>
          )}
        </Field>

        {/* Engagement */}
        <Field
          label="Overall engagement"
          required
          hint="How engaged were participants throughout the session?"
        >
          <StarPicker
            value={form.engagement}
            onChange={(n) => set("engagement", n)}
          />
          {errors.engagement && (
            <p className="text-xs text-red-500 mt-1">{errors.engagement}</p>
          )}
        </Field>

        {/* Highlights */}
        <Field
          label="Highlights"
          required
          hint="What went well? Any memorable moments?"
        >
          <textarea
            rows={3}
            value={form.highlights}
            onChange={(e) => set("highlights", e.target.value)}
            placeholder="The storytelling activity generated unexpected vulnerability..."
            className={textareaClass}
          />
          {errors.highlights && (
            <p className="text-xs text-red-500 mt-1">{errors.highlights}</p>
          )}
        </Field>

        {/* Challenges */}
        <Field
          label="Challenges"
          required
          hint="What was difficult or did not go as planned?"
        >
          <textarea
            rows={3}
            value={form.challenges}
            onChange={(e) => set("challenges", e.target.value)}
            placeholder="Step 3 ran long. Two participants were disengaged during the activity..."
            className={textareaClass}
          />
          {errors.challenges && (
            <p className="text-xs text-red-500 mt-1">{errors.challenges}</p>
          )}
        </Field>

        {/* Notes */}
        <Field label="Additional notes" hint="Optional — anything else to flag">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Venue was too small. Consider booking a larger space next time..."
            className={textareaClass}
          />
        </Field>

        {/* Fidelity score — read-only, populated from session player */}
        {fidelityScore !== undefined && (() => {
          const { bg, text } = fidelityColour(fidelityScore);
          return (
            <div className="flex items-center justify-between rounded-xl border border-[#EDE4D3] bg-[#F8F4EC] px-4 py-3">
              <div>
                <p className="text-xs font-medium text-[#1F2937]">Session fidelity</p>
                <p className="text-xs text-[#1F2937]/40 mt-0.5">Captured automatically from your session</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${bg} ${text}`}>
                {fidelityScore}% · {fidelityLabel(fidelityScore)}
              </span>
            </div>
          );
        })()}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[#1F4D3A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#173d2e] transition-colors"
      >
        Submit Report
      </button>
    </form>
  );
}
