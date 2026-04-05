import { NextRequest, NextResponse } from "next/server";
import { getSupabaseProxyClient } from "@/app/_lib/supabase-server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Start with a plain "continue" response so we can attach refreshed cookies.
  let response = NextResponse.next({ request });

  const supabase = getSupabaseProxyClient(request, response);

  // If Supabase isn't configured (e.g. local dev without .env.local),
  // let all requests through so the app still renders.
  if (!supabase) return response;

  // IMPORTANT: always use getUser() — not getSession().
  // getUser() validates the token with the Supabase server on every call,
  // making it safe for auth decisions. getSession() only reads the local cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/login";
  const isProtectedRoute =
    pathname.startsWith("/sessions") ||
    pathname.startsWith("/report") ||
    pathname.startsWith("/admin");

  // Not signed in → redirect to login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already signed in → skip the login page
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/sessions", request.url));
  }

  // Admin section → only users with role: "admin" in their metadata
  if (user && pathname.startsWith("/admin")) {
    const role = user.user_metadata?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/sessions", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
