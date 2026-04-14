import Link from "next/link";
import { MOCK_SESSIONS, type Session, type SessionStatus } from "@/app/_lib/mock-data";

const STATUS_STYLES: Record<SessionStatus, string> = {
  "upcoming":    "bg-[#EDE4D3] text-[#7A5C3E]",
  "in-progress": "bg-[#D9B44A]/20 text-[#7A5C3E]",
  "completed":   "bg-[#1F4D3A]/10 text-[#1F4D3A]",
};

const STATUS_LABELS: Record<SessionStatus, string> = {
  "upcoming":    "Upcoming",
  "in-progress": "In Progress",
  "completed":   "Completed",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SessionCard({ session }: { session: Session }) {
  const isCompleted = session.status === "completed";

  return (
    <Link
      href={`/sessions/${session.id}`}
      className="block rounded-2xl bg-white border border-[#EDE4D3] p-4 hover:border-[#1F4D3A]/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-[#1F2937] text-sm leading-snug">
          {session.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[session.status]}`}
        >
          {STATUS_LABELS[session.status]}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-[#1F2937]/50 line-clamp-2">
        {session.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#1F2937]/40">
        <span>{formatDate(session.date)}</span>
        <span>{session.location}</span>
        <span>{session.facilitator}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#1F2937]/40">
        <span>{session.totalSteps} steps</span>
        {isCompleted ? (
          <span className="text-[#1F4D3A] font-medium">Done ✓</span>
        ) : (
          <span className="text-[#7A5C3E] font-medium">Open →</span>
        )}
      </div>
    </Link>
  );
}

export default function SessionsPage() {
  const upcoming  = MOCK_SESSIONS.filter((s) => s.status === "upcoming");
  const active    = MOCK_SESSIONS.filter((s) => s.status === "in-progress");
  const completed = MOCK_SESSIONS.filter((s) => s.status === "completed");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#1F2937]">Sessions</h1>

      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
            In Progress
          </h2>
          {active.map((s) => <SessionCard key={s.id} session={s} />)}
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
            Upcoming
          </h2>
          {upcoming.map((s) => <SessionCard key={s.id} session={s} />)}
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
            Completed
          </h2>
          {completed.map((s) => <SessionCard key={s.id} session={s} />)}
        </section>
      )}
    </div>
  );
}
