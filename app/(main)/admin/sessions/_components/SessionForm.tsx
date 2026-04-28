"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/app/_lib/supabase";

const CURRICULUM_TEMPLATES = [
  {
    id: "period_foundations",
    title: "Menstrual Health Basics",
    description:
      "An introductory session on puberty, periods, menstrual health, hygiene, and practical support.",
  },
  {
    id: "srh_consent_protection",
    title: "Healthy Relationships and Consent",
    description:
      "A guided session on respect, boundaries, consent, protection, and help-seeking.",
  },
];

type FormState = {
  title: string;
  description: string;
  date: string;
  location: string;
  assigned_to: string;
  template_id: string;
};

const EMPTY: FormState = {
  title: "",
  description: "",
  date: "",
  location: "",
  assigned_to: "",
  template_id: "",
};

const inputClass =
  "w-full rounded-lg border border-[#EDE4D3] bg-white px-3 py-2 text-sm text-[#1F2937] placeholder:text-[#1F2937]/30 focus:border-[#1F4D3A] focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/10 transition";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#1F2937]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function SessionForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleTemplateChange(templateId: string) {
    const template = CURRICULUM_TEMPLATES.find((t) => t.id === templateId);

    if (!template) {
      setForm((f) => ({
        ...f,
        template_id: "",
      }));
      return;
    }

    setForm((f) => ({
      ...f,
      template_id: templateId,
      title: template.title,
      description: template.description,
    }));
    setErrors((e) => ({ ...e, template_id: undefined, title: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};

    if (!form.title.trim()) next.title = "Required.";
    if (!form.date) next.date = "Required.";
    if (!form.location.trim()) next.location = "Required.";
    if (!form.assigned_to.trim()) {
      next.assigned_to = "Required.";
    } else if (!form.assigned_to.includes("@")) {
      next.assigned_to = "Enter a valid email address.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setServerError(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setServerError("Supabase is not configured.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("sessions").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      location: form.location.trim(),
      assigned_to: form.assigned_to.trim().toLowerCase(),
      facilitator_email: form.assigned_to.trim().toLowerCase(),
      template_id: form.template_id || null,
      status: "upcoming",
    });

    if (error) {
      setServerError(error.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setForm(EMPTY);
    router.refresh();
    setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
  }

  return (
    <div className="rounded-3xl border border-[#EDE4D3] bg-white p-6 sm:p-8 space-y-6">
      <h2 className="text-xl font-semibold text-[#1F2937]">Create new session</h2>

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Session created successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Curriculum template">
          <select
            value={form.template_id}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className={inputClass}
          >
            <option value="">— Select a template (optional) —</option>
            {CURRICULUM_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-[#1F2937]/40">
            Selecting a template auto-fills the title and loads step-by-step guidance for facilitators.
          </p>
        </Field>

        <Field label="Session title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Menstrual Health Basics — Cohort 3"
            className={inputClass}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Brief description of this session's focus"
            className={inputClass + " resize-none"}
            rows={3}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date" required>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputClass}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </Field>

          <Field label="Location / site" required>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Community Hall, Nairobi"
              className={inputClass}
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </Field>
        </div>

        <Field label="Assign to facilitator" required>
          <input
            type="email"
            value={form.assigned_to}
            onChange={(e) => set("assigned_to", e.target.value)}
            placeholder="facilitator@example.com"
            className={inputClass}
          />
          {errors.assigned_to && (
            <p className="text-xs text-red-500 mt-1">{errors.assigned_to}</p>
          )}
        </Field>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-green)" }}
        >
          {saving ? "Creating…" : "Create session"}
        </button>
      </form>
    </div>
  );
}