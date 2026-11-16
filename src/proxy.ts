import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Presence-only check (no DB in proxy). `getSessionCookie` matches both the
  // bare `better-auth.session_token` (local http) and the `__Secure-`-prefixed
  // name better-auth sets behind https (Vercel) — a plain startsWith check
  // rejects valid production sessions and bounces logged-in users to /sign-in.
  const hasSession = getSessionCookie(request) !== null;

  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    const nextPath =
      request.nextUrl.pathname + request.nextUrl.search;
    if (nextPath && nextPath !== "/") {
      signInUrl.searchParams.set("next", nextPath);
    }
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Routes behind auth: profile, destination detail/edit, add + bookings.
  // `/destinations` list stays public, `:path+` requires 1+ segments.
  // Every entry MUST start with "/" — a bare path invalidates the whole
  // config (dev server crash + build failure + no route protected).
  matcher: ["/profile", "/destinations/:path+", "/add-destinations", "/bookings"],
};
