"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { syncPendingReports, loadPendingReports } from "@/app/_lib/reports";

// ─── Context ──────────────────────────────────────────────────────────────────

type SyncState = {
  isOnline: boolean;
  pending: number;      // reports not yet uploaded
  syncing: boolean;     // upload in-flight
  lastSynced: Date | null;
  triggerSync: () => void;
};

const SyncContext = createContext<SyncState>({
  isOnline: true,
  pending: 0,
  syncing: false,
  lastSynced: null,
  triggerSync: () => {},
});

export function useSyncStatus() {
  return useContext(SyncContext);
}

// ─── Banner ───────────────────────────────────────────────────────────────────
// One narrow strip below the NavBar. Shows exactly one state at a time.
// Priority: offline > syncing > pending > synced > (hidden)

function SyncBanner() {
  const { isOnline, pending, syncing, lastSynced, triggerSync } = useSyncStatus();
  const [showSynced, setShowSynced] = useState(false);

  // Auto-dismiss the "All synced" confirmation after 4 seconds
  useEffect(() => {
    if (lastSynced) {
      setShowSynced(true);
      const t = setTimeout(() => setShowSynced(false), 4000);
      return () => clearTimeout(t);
    }
  }, [lastSynced]);

  // ── Offline ──────────────────────────────────────────────────────────────
  if (!isOnline) {
    return (
      <div className="bg-[#1F2937]/8 border-b border-[#1F2937]/10 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-[#1F2937]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F2937]/30 shrink-0" />
        Offline — changes save locally and sync when reconnected
      </div>
    );
  }

  // ── Syncing ───────────────────────────────────────────────────────────────
  if (syncing) {
    return (
      <div className="bg-[#1F4D3A]/8 border-b border-[#1F4D3A]/10 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-[#1F4D3A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F4D3A]/60 shrink-0 animate-pulse" />
        Syncing reports…
      </div>
    );
  }

  // ── Pending (online, but unsynced reports) ────────────────────────────────
  if (pending > 0) {
    return (
      <div className="bg-[#D9B44A]/10 border-b border-[#D9B44A]/20 px-4 py-1.5 flex items-center justify-between text-xs text-[#7A5C3E]">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9B44A] shrink-0" />
          {pending} report{pending !== 1 ? "s" : ""} waiting to sync
        </span>
        <button
          onClick={triggerSync}
          className="font-semibold underline underline-offset-2 hover:text-[#1F2937] transition-colors"
        >
          Sync now
        </button>
      </div>
    );
  }

  // ── All synced (auto-dismisses) ───────────────────────────────────────────
  if (showSynced) {
    return (
      <div className="bg-[#1F4D3A]/8 border-b border-[#1F4D3A]/10 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-[#1F4D3A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F4D3A] shrink-0" />
        All reports synced
      </div>
    );
  }

  return null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  // Start optimistically online — corrected after hydration to avoid mismatch
  const [isOnline, setIsOnline] = useState(true);
  const [pending, setPending]   = useState(0);
  const [syncing, setSyncing]   = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  function refreshPendingCount() {
    try {
      setPending(loadPendingReports().length);
    } catch {
      setPending(0);
    }
  }

  const runSync = useCallback(async () => {
    if (syncing || !navigator.onLine) return;
    setSyncing(true);
    try {
      const synced = await syncPendingReports();
      if (synced > 0) setLastSynced(new Date());
      refreshPendingCount();
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  // Hydrate real online state + count pending reports
  useEffect(() => {
    setIsOnline(navigator.onLine);
    refreshPendingCount();
  }, []);

  // Online/offline listeners
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      refreshPendingCount();
      runSync();
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attempt sync on first render if online
  useEffect(() => {
    runSync();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SyncContext.Provider
      value={{ isOnline, pending, syncing, lastSynced, triggerSync: runSync }}
    >
      <SyncBanner />
      {children}
    </SyncContext.Provider>
  );
}
