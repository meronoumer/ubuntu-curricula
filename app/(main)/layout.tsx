import NavBar from "@/app/_components/NavBar";
import SyncProvider from "@/app/_components/SyncProvider";
import { getSupabaseServerClient } from "@/app/_lib/supabase-server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the current user server-side so the NavBar knows which links to show.
  // getSupabaseServerClient reads the session cookie — no extra network call needed.
  const supabase = await getSupabaseServerClient();
  let isAdmin = false;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAdmin = user?.user_metadata?.role === "admin";
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar isAdmin={isAdmin} />
      <SyncProvider>
        <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
          {children}
        </main>
      </SyncProvider>
    </div>
  );
}
