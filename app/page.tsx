import Link from "next/link";

// ─── Static data ──────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Load your session",
    description:
      "Pick a structured curriculum module. Every session comes with step-by-step facilitation guides so anyone can run it confidently.",
  },
  {
    number: "02",
    title: "Facilitate and capture",
    description:
      "Walk participants through each activity. Log attendance, record highlights, and note challenges — right from your phone.",
  },
  {
    number: "03",
    title: "See the impact",
    description:
      "Engagement scores, attendance trends, and session summaries sync automatically. Leaders get real data, not guesswork.",
  },
];

const features = [
  {
    icon: "📚",
    title: "Structured curriculum modules",
    description:
      "Every session is broken into guided steps with clear instructions. Facilitators always know what comes next — no improvising required.",
  },
  {
    icon: "✅",
    title: "Attendance & participation tracking",
    description:
      "Log who showed up and how engaged they were. Works offline and syncs when you're back online.",
  },
  {
    icon: "📊",
    title: "Progress & data insights",
    description:
      "Admins see live dashboards with engagement scores, attendance counts, and facilitator notes across every session.",
  },
];

const comparisons = [
  {
    tool: "WhatsApp",
    problems: ["Reports get buried in chats", "No structure or consistency", "Zero data for leaders"],
  },
  {
    tool: "Google Drive",
    problems: ["Slow and hard to use in the field", "No attendance tracking", "Manually compiled reports"],
  },
  {
    tool: "Ubuntu Curriculum",
    problems: ["Guided, step-by-step sessions", "Live attendance + engagement logs", "Instant admin dashboards"],
    isUs: true,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-bold text-indigo-700 tracking-wide">
            Ubuntu Curriculum
          </span>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-indigo-700 transition-colors"
          >
            Sign in →
          </Link>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 pt-20 pb-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            Built for NGO facilitators
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Run better sessions.
            <br />
            <span className="text-indigo-600">Capture real impact.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Ubuntu Curriculum gives facilitators a step-by-step guide for every
            session and gives leaders the data to see what&apos;s actually
            working — no spreadsheets, no lost WhatsApp messages.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Facilitator login
            </Link>
            <Link
              href="/sessions"
              className="rounded-xl bg-white border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors shadow-sm"
            >
              View sessions
            </Link>
            <Link
              href="/admin"
              className="rounded-xl bg-white border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors shadow-sm"
            >
              Admin dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              From preparation to impact — in three steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative space-y-3">
                <span className="text-4xl font-black text-indigo-100 select-none">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold text-gray-900 -mt-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Everything a facilitator needs
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              Built for the field — works on any phone, even offline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ───────────────────────────────────────────────────── */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Why not just use WhatsApp?
            </h2>
            <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">
              Most NGO teams rely on makeshift tools. We built something purpose-fit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comparisons.map((col) => (
              <div
                key={col.tool}
                className={`rounded-2xl border p-6 space-y-4 ${
                  col.isUs
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                    : "bg-gray-50 border-gray-100 text-gray-700"
                }`}
              >
                <h3
                  className={`font-bold text-sm tracking-wide ${
                    col.isUs ? "text-indigo-100" : "text-gray-400"
                  }`}
                >
                  {col.tool}
                </h3>
                <ul className="space-y-2">
                  {col.problems.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-0.5 shrink-0 ${
                          col.isUs ? "text-indigo-200" : "text-red-400"
                        }`}
                      >
                        {col.isUs ? "✓" : "✗"}
                      </span>
                      <span className={col.isUs ? "text-white" : "text-gray-600"}>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Ready to run better sessions?
          </h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Join the facilitators already using Ubuntu Curriculum to deliver
            structured, trackable programmes — right from their phones.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-white text-indigo-700 px-8 py-3 text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Get started →
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 px-4 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-white tracking-wide">
            Ubuntu Curriculum
          </span>
          <p className="text-center">
            Helping facilitators deliver structured learning programmes.
          </p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/sessions" className="hover:text-white transition-colors">
              Sessions
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
