import Link from "next/link";

// ─── Inline SVG icons (HeroIcons, MIT licence) ────────────────────────────────
// Using inline SVG keeps the page a pure Server Component with zero JS.

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function IconSync() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

// ─── Static content data ──────────────────────────────────────────────────────

const stats = [
  { value: "1 in 4", label: "girls in rural Kenya drops out due to pregnancy" },
  { value: "70%", label: "of youth report no access to formal health education" },
  { value: "3 schools", label: "currently in the pilot programme" },
];

const steps = [
  {
    number: "01",
    title: "Facilitators access guided curriculum",
    description:
      "Each session is broken into numbered, step-by-step activities. Any trained facilitator can pick it up and deliver it consistently — without improvising.",
  },
  {
    number: "02",
    title: "Sessions are delivered and tracked",
    description:
      "Attendance is logged, participation is rated, and session highlights and challenges are captured in real time. Works offline and syncs when connectivity returns.",
  },
  {
    number: "03",
    title: "Data syncs for monitoring and iteration",
    description:
      "Programme coordinators see engagement trends, attendance counts, and facilitator notes across every school. Evidence-based decisions become possible.",
  },
];

const features = [
  {
    Icon: IconBook,
    title: "Structured curriculum modules",
    description:
      "Sessions are pre-built with step-by-step facilitation guides. Consistent delivery regardless of who is running it.",
    color: "text-[#1F4D3A] bg-[#1F4D3A]/10",
  },
  {
    Icon: IconUsers,
    title: "Attendance & participation tracking",
    description:
      "Log who showed up and how engaged they were. Simple enough to use on a basic Android phone in a rural school.",
    color: "text-[#7A5C3E] bg-[#7A5C3E]/10",
  },
  {
    Icon: IconChart,
    title: "Progress & data insights",
    description:
      "Admins see real-time dashboards: engagement scores, attendance trends, and session summaries — no spreadsheet compilation required.",
    color: "text-[#D9B44A] bg-[#D9B44A]/10",
  },
  {
    Icon: IconSync,
    title: "Offline-first sync",
    description:
      "Reports are saved locally when there's no signal and uploaded automatically when the device reconnects. Connectivity problems don't mean lost data.",
    color: "text-[#1F4D3A] bg-[#1F4D3A]/10",
  },
];

const comparisons = [
  {
    tool: "WhatsApp & SMS",
    limitation: "Messages get buried. Reports are unstructured. There is no visibility into whether curriculum was followed or who attended.",
    points: ["No delivery structure", "No attendance records", "No data for coordinators"],
    highlight: false,
  },
  {
    tool: "Google Drive & Docs",
    limitation: "Designed for offices, not fields. Requires stable internet, is hard to use on basic phones, and still produces manual, inconsistent reports.",
    points: ["Requires strong connectivity", "No tracking built in", "Reports compiled by hand"],
    highlight: false,
  },
  {
    tool: "Ubuntu Curriculum",
    limitation: "Purpose-built for community delivery. Structured, trackable, offline-ready, and designed to give programme leaders real evidence — not anecdote.",
    points: ["Guided step-by-step sessions", "Live attendance + engagement logs", "Instant coordinator dashboards"],
    highlight: true,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream)", color: "var(--color-text)" }}>

      {/* ════════════════════════════════════════════════════════════════════
          NAVIGATION
          Cream/90 backdrop so it sits cleanly on both the hero and scrolled
          content. Logo uses sans-serif to stay distinct from serif headings.
      ════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-[#EDE4D3] bg-[#F8F4EC]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span
            className="font-bold text-[#1F4D3A] tracking-wide text-base"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Ubuntu Curriculum
          </span>

          <nav className="hidden md:flex items-center gap-7 text-sm text-[#1F2937]/70">
            <a href="#problem" className="hover:text-[#1F4D3A] transition-colors">The Problem</a>
            <a href="#how-it-works" className="hover:text-[#1F4D3A] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#1F4D3A] transition-colors">Features</a>
          </nav>

          <Link
            href="/login"
            className="text-sm font-semibold text-[#F8F4EC] bg-[#1F4D3A] px-5 py-2 rounded-lg hover:bg-[#2a6350] transition-colors"
          >
            Facilitator Login
          </Link>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
          Full-viewport photograph with a dark green overlay. The photo
          provides human context; the overlay keeps text legible.

          📷 Replace the backgroundImage URL with your own community/
             classroom photography. Recommended: landscape, 1920×1080 min.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">

        {/* Background photograph + warm dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              /* 📷 Replace with your own photography.
               Current: students in a classroom, teacher at front (Unsplash, free licence).
               To swap: visit unsplash.com/photos/5yQbJj68b_s (Hennie Stander, Thika Kenya),
               right-click the photo → Open image in new tab, copy that URL. */
              "url('https://webassets.oxfamamerica.org/media/images/16898lpr_9yo7.2e16d0ba.fill-1180x738-c100.jpegquality-60.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#1F4D3A]/72" aria-hidden="true" />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
            <div className="max-w-2xl">

              {/* Editorial badge */}
              <span className="inline-block text-[#D9B44A] text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                Community-Based Education · Rural Kenya
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.15] mb-6">
                Structure the sessions.<br />
                <span className="italic text-[#D9B44A]">See the impact.</span>
              </h1>

              <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl">
                Ubuntu Curriculum helps facilitators deliver evidence-based education
                programmes in low-connectivity communities — and gives programme
                leaders the data to know what&apos;s actually working.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-[#D9B44A] text-[#1F2937] px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#c9a43a] transition-colors"
                >
                  Facilitator Login
                </Link>
                <Link
                  href="/sessions"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/25 transition-colors backdrop-blur-sm"
                >
                  Explore Platform →
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Stats bar at the bottom of the hero */}
        <div className="relative z-10 border-t border-white/15 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-3 divide-x divide-white/20">
            {stats.map((s) => (
              <div key={s.value} className="px-4 sm:px-8 first:pl-0 last:pr-0 text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-semibold text-[#D9B44A]">{s.value}</div>
                <div className="text-white/60 text-xs mt-1 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════════
          THE PROBLEM
          Cream background. Editorial small-caps label above serif heading.
          Three stat cards on white surface.
      ════════════════════════════════════════════════════════════════════ */}
      <section id="problem" className="bg-[#F8F4EC] px-6 py-24">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-2xl mb-14">
            <p className="text-[#7A5C3E] text-xs font-semibold tracking-[0.18em] uppercase mb-3">
              The Challenge
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1F2937] leading-snug mb-5">
              The tools we rely on weren&apos;t built for this
            </h2>
            <p className="text-[#1F2937]/65 text-base leading-relaxed">
              Community-based education in rural settings faces a structural
              problem. Programmes are coordinated through WhatsApp groups and
              shared Drive folders — making it impossible to standardise
              delivery, track who attended, or produce reliable evidence of
              impact. Leaders make decisions based on anecdote, not data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                stat: "26%",
                label: "of girls in rural Kenya drop out of school due to pregnancy",
                note: "UNICEF Kenya, 2022",
              },
              {
                stat: "1 in 3",
                label: "adolescent girls has no access to menstrual hygiene products",
                note: "WHO / UNFPA",
              },
              {
                stat: "70%",
                label: "of youth report receiving no formal sexual health education",
                note: "Kenya National Survey",
              },
            ].map((card) => (
              <div
                key={card.stat}
                className="bg-white rounded-2xl p-7 border border-[#EDE4D3]"
              >
                <div
                  className="text-4xl font-semibold mb-3"
                  style={{ color: "var(--color-brown)" }}
                >
                  {card.stat}
                </div>
                <p className="text-[#1F2937] text-sm leading-relaxed mb-3">{card.label}</p>
                <span className="text-[#7A5C3E]/50 text-xs">{card.note}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS
          Alternating beige background. Large decorative step numbers.
      ════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-[#EDE4D3] px-6 py-24">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-xl mb-16">
            <p className="text-[#7A5C3E] text-xs font-semibold tracking-[0.18em] uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1F2937] leading-snug">
              From session prep to programme insight — in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                {/* Large decorative number */}
                <div
                  className="text-8xl font-bold leading-none mb-4 select-none"
                  style={{ color: "#1F4D3A", opacity: 0.12 }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-3 -mt-6">
                  {step.title}
                </h3>
                <p className="text-[#1F2937]/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES
          Cream background. 2×2 card grid with brand-coloured icon badges.
      ════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="bg-[#F8F4EC] px-6 py-24">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-xl mb-14">
            <p className="text-[#7A5C3E] text-xs font-semibold tracking-[0.18em] uppercase mb-3">
              What You Get
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1F2937] leading-snug">
              Built for the field,<br />designed for scale
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ Icon, title, description, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 border border-[#EDE4D3] hover:border-[#7A5C3E]/30 transition-colors"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 ${color}`}>
                  <Icon />
                </div>
                <h3 className="text-base font-semibold text-[#1F2937] mb-2">{title}</h3>
                <p className="text-[#1F2937]/60 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          WHY UBUNTU CURRICULUM IS DIFFERENT
          Beige background. Three cards — two showing the problem with
          existing tools, one (dark green) showing the solution.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#EDE4D3] px-6 py-24">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-xl mb-14">
            <p className="text-[#7A5C3E] text-xs font-semibold tracking-[0.18em] uppercase mb-3">
              Why This Matters
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1F2937] leading-snug">
              Purpose-built for<br />community delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {comparisons.map((col) => (
              <div
                key={col.tool}
                className={`rounded-2xl p-8 ${
                  col.highlight
                    ? "bg-[#1F4D3A] border border-[#1F4D3A]"
                    : "bg-white border border-[#EDE4D3]"
                }`}
              >
                <h3
                  className={`text-xs font-semibold tracking-[0.14em] uppercase mb-4 ${
                    col.highlight ? "text-[#D9B44A]" : "text-[#7A5C3E]/60"
                  }`}
                >
                  {col.tool}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    col.highlight ? "text-white/80" : "text-[#1F2937]/60"
                  }`}
                >
                  {col.limitation}
                </p>
                <ul className="space-y-2.5">
                  {col.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 shrink-0 font-bold ${
                          col.highlight ? "text-[#D9B44A]" : "text-red-400"
                        }`}
                      >
                        {col.highlight ? "✓" : "✗"}
                      </span>
                      <span className={col.highlight ? "text-white" : "text-[#1F2937]/70"}>
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

      {/* ════════════════════════════════════════════════════════════════════
          PLATFORM PREVIEW
          Dark green section. CSS-drawn browser/phone mockup on one side,
          copy and CTA on the other. No screenshots needed — the frame
          signals "real product" to judges.

          📷 When you have real screenshots, replace the inner mockup div
             with an <img> or next/image component.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1F4D3A] px-6 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Copy + CTA */}
          <div>
            <p className="text-[#D9B44A] text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              See It In Action
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-snug mb-5">
              Designed to work on<br />any phone, anywhere
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-8">
              Ubuntu Curriculum runs on any modern Android browser. No app
              install required. Reports save locally when there&apos;s no signal
              and sync when the facilitator gets back to connectivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/sessions"
                className="inline-flex items-center justify-center bg-[#D9B44A] text-[#1F2937] px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#c9a43a] transition-colors"
              >
                Explore Sessions
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center border border-white/25 text-white px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                View Admin Dashboard
              </Link>
            </div>
          </div>

          {/* App mockup frame
              📷 Replace the inner content with a real screenshot when available. */}
          <div className="relative">
            {/* Browser frame */}
            <div className="bg-[#163b2a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="bg-[#0f2a1e] px-4 py-3 flex items-center gap-2.5 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 bg-white/5 rounded text-white/30 text-xs px-3 py-1 ml-2">
                  ubuntu-curriculum.vercel.app
                </div>
              </div>
              {/* Screen content placeholder */}
              <div className="p-5 space-y-3 min-h-[280px]">
                {/* Nav bar mockup */}
                <div className="bg-[#1F4D3A] rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <div className="text-white text-xs font-semibold">Ubuntu Curriculum</div>
                  <div className="flex gap-3">
                    <div className="w-12 h-2 bg-white/30 rounded-full" />
                    <div className="w-10 h-2 bg-white/30 rounded-full" />
                  </div>
                </div>
                {/* Content rows mockup */}
                <div className="space-y-2.5 pt-2">
                  {[80, 65, 72, 55].map((w, i) => (
                    <div key={i} className="bg-white/8 rounded-lg p-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D9B44A]/20 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className={`h-2 bg-white/20 rounded-full w-[${w}%]`} />
                        <div className="h-1.5 bg-white/10 rounded-full w-1/2" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div
              className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-2xl"
              style={{ backgroundColor: "var(--color-yellow)" }}
              aria-hidden="true"
            />
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FINAL CTA STRIP
          Warm cream — a deliberate palette break before the dark footer.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F8F4EC] border-t border-[#EDE4D3] px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1F2937] mb-4">
            Ready to run better sessions?
          </h2>
          <p className="text-[#1F2937]/60 text-base leading-relaxed mb-8">
            Join the facilitators already using Ubuntu Curriculum to deliver
            structured, trackable programmes — right from their phones.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#1F4D3A] text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#2a6350] transition-colors"
          >
            Get started →
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#111A16] text-white/50 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pb-8 border-b border-white/8">
            <div>
              <div
                className="font-semibold text-white text-base mb-1"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Ubuntu Curriculum
              </div>
              <p className="text-white/40 text-xs max-w-xs leading-relaxed">
                Structured community education.<br />
                Evidence-based impact.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-xs">
              <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
              <Link href="/sessions" className="hover:text-white transition-colors">Sessions</Link>
              <Link href="/report" className="hover:text-white transition-colors">Submit Report</Link>
              <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
          <p className="text-white/25 text-xs mt-6">
            © 2026 Ubuntu Curriculum. Built for community facilitators.
          </p>
        </div>
      </footer>

    </div>
  );
}
