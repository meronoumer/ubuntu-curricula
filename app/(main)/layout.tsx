import NavBar from "@/app/_components/NavBar";
import SyncProvider from "@/app/_components/SyncProvider";
import { getSupabaseServerClient } from "@/app/_lib/supabase-server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  let isAdmin = false;
  let userEmail = "";

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAdmin = user?.user_metadata?.role === "admin";
    userEmail = user?.email ?? "";
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EC]">
      <NavBar isAdmin={isAdmin} userEmail={userEmail} />
      <SyncProvider>
        <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
          {children}
        </main>
      </SyncProvider>
    </div>
  );
}
