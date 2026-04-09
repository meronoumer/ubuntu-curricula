"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/app/_lib/supabase";

const facilitatorLinks = [
  { href: "/sessions", label: "Sessions" },
  { href: "/report", label: "Report" },
];

type NavBarProps = {
  isAdmin: boolean;
  userEmail: string;
};

export default function NavBar({ isAdmin, userEmail }: NavBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabaseClient();
    if (supabase) await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  const links = isAdmin
    ? [...facilitatorLinks, { href: "/admin", label: "Admin" }]
    : facilitatorLinks;

  // Derive a short display name from the email, e.g. "fatima@org.com" → "fatima"
  const displayName = userEmail ? userEmail.split("@")[0] : "";
  const initial = displayName.charAt(0).toUpperCase();
  const roleLabel = isAdmin ? "Admin" : "Facilitator";

  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between gap-4">

      {/* Brand */}
      <span className="font-bold tracking-wide text-sm shrink-0">
        Ubuntu Curriculum
      </span>

      {/* Page links */}
      <div className="flex gap-4 text-sm">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              pathname.startsWith(href)
                ? "font-semibold underline underline-offset-4"
                : "opacity-80 hover:opacity-100 transition-opacity"
            }
          >
            {label}
          </Link>
        ))}
      </div>

      {/* User identity + sign out */}
      {userEmail && (
        <div className="flex items-center gap-3 text-sm shrink-0">
          {/* Avatar initial */}
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
            {initial}
          </div>

          {/* Name + role badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-indigo-100 text-xs">{displayName}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isAdmin
                  ? "bg-amber-400 text-amber-900"
                  : "bg-indigo-500 text-white"
              }`}
            >
              {roleLabel}
            </span>
          </div>

          {/* Divider */}
          <span className="border-l border-indigo-500 h-4" />

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="text-indigo-200 hover:text-white transition-colors text-xs"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
