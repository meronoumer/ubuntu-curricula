"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  saveSessions,
  loadSessions,
  sessionCacheAge,
  type CachedSession,
} from "@/app/_lib/session-cache";
import type { SessionStatus } from "@/app/_lib/mock-data";

// ─── Styles ───────────────────────────────────────────────────────────────────

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

// ─── Session card ─────────────────────────────────────────────────────────────

function SessionCard({ session }: { session: CachedSession }) {
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
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[session.status]}`}>
          {STATUS_LABELS[session.status]}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-[#1F2937]/50 line-clamp-2">
        {session.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#1F2937]/40">
        <span>{formatDate(session.date)}</span>
        <span>{session.location}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#1F2937]/40">
        {session.totalSteps > 0 && <span>{session.totalSteps} steps</span>}
        {isCompleted ? (
          <span className="text-[#1F4D3A] font-medium">Done ✓</span>
        ) : (
          <span className="text-[#7A5C3E] font-medium">Open →</span>
        )}
      </div>
    </Link>
  );
}

function Section({ label, sessions }: { label: string; sessions: CachedSession[] }) {
  if (sessions.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
        {label}
      </h2>
      {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = {
  // Sessions fetched server-side (empty array when Supabase unreachable)
  initialSessions: CachedSession[];
};

export default function SessionsDisplay({ initialSessions }: Props) {
  const [sessions, setSessions] = useState<CachedSession[]>(initialSessions);
  const [fromCache, setFromCache] = useState(false);
  const [cacheAge, setCacheAge] = useState<string | null>(null);

  useEffect(() => {
    if (initialSessions.length > 0) {
      // We have fresh data — write it to the cache
      saveSessions(initialSessions);
      setFromCache(false);
    } else {
      // Server returned nothing (offline or Supabase down) — try cache
      const cached = loadSessions();
      if (cached.length > 0) {
        setSessions(cached);
        setFromCache(true);
        setCacheAge(sessionCacheAge());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active    = sessions.filter((s) => s.status === "in-progress");
  const upcoming  = sessions.filter((s) => s.status === "upcoming");
  const completed = sessions.filter((s) => s.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#1F2937]">Sessions</h1>
        {fromCache && (
          <span className="text-xs text-[#7A5C3E] bg-[#EDE4D3] px-2.5 py-1 rounded-full">
            Cached · {cacheAge}
          </span>
        )}
      </div>

      {sessions.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#EDE4D3] p-12 text-center">
          <p className="text-sm text-[#1F2937]/40">
            No sessions available. Connect to the internet to load your sessions.
          </p>
        </div>
      )}

      <Section label="In Progress" sessions={active} />
      <Section label="Upcoming"    sessions={upcoming} />
      <Section label="Completed"   sessions={completed} />
    </div>
  );
}
