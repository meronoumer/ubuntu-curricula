"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "@/app/_lib/supabase";

// Links every authenticated user can see
const facilitatorLinks = [
  { href: "/sessions", label: "Sessions" },
  { href: "/report", label: "Report" },
];

export default function NavBar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabaseClient();
    if (supabase) await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  // Admins see all three links; facilitators see only Sessions + Report
  const links = isAdmin
    ? [...facilitatorLinks, { href: "/admin", label: "Admin" }]
    : facilitatorLinks;

  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
      <span className="font-bold tracking-wide text-sm">Ubuntu Curriculum</span>
      <div className="flex gap-4 text-sm items-center">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              pathname.startsWith(href)
                ? "font-semibold underline underline-offset-4"
                : "opacity-80 hover:opacity-100"
            }
          >
            {label}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
