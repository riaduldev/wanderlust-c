import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith(SESSION_COOKIE));

  if (!hasSession) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only routes behind auth: profile and destination detail/edit pages.
  // `/destinations` itself stays public, `:path+` requires 1+ segments.
  matcher: ["/profile", "/destinations/:path+"],
};
