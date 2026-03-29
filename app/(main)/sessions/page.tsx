import Link from "next/link";
import { MOCK_SESSIONS, type Session, type SessionStatus } from "@/app/_lib/mock-data";

const STATUS_STYLES: Record<SessionStatus, string> = {
  "upcoming":    "bg-blue-50 text-blue-700",
  "in-progress": "bg-amber-50 text-amber-700",
  "completed":   "bg-green-50 text-green-700",
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
      className="block rounded-2xl bg-white shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-gray-900 text-sm leading-snug">
          {session.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[session.status]}`}
        >
          {STATUS_LABELS[session.status]}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-gray-500 line-clamp-2">
        {session.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        <span>{formatDate(session.date)}</span>
        <span>{session.location}</span>
        <span>{session.facilitator}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>{session.totalSteps} steps</span>
        {isCompleted ? (
          <span className="text-green-600 font-medium">Done</span>
        ) : (
          <span className="text-indigo-600 font-medium">Open →</span>
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
      <h1 className="text-xl font-bold text-gray-900">Sessions</h1>

      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            In Progress
          </h2>
          {active.map((s) => <SessionCard key={s.id} session={s} />)}
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Upcoming
          </h2>
          {upcoming.map((s) => <SessionCard key={s.id} session={s} />)}
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Completed
          </h2>
          {completed.map((s) => <SessionCard key={s.id} session={s} />)}
        </section>
      )}
    </div>
  );
}
