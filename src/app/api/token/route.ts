import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { signApiJwt } from "@/lib/jwt";

/**
 * POST /api/token — exchanges the better-auth session cookie for a
 * short-lived JWT that client components send as `Authorization: Bearer`
 * when calling protected APIs (Express :8000 and /api/travel-packages).
 * POST-only so nothing preloads or caches it.
 */

const TOKEN_TTL = "15m";
const TOKEN_TTL_SECONDS = 15 * 60;

export async function POST() {
  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { message: "API auth is not configured. Set JWT_SECRET in .env." },
      { status: 503 },
    );
  }

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session) {
    return NextResponse.json(
      { message: "Sign in to continue." },
      { status: 401 },
    );
  }

  try {
    const token = await signApiJwt(
      {
        sub: session.user.id,
        typ: "user",
        email: session.user.email,
        name: session.user.name,
      },
      TOKEN_TTL,
    );

    return NextResponse.json({ token, expiresIn: TOKEN_TTL_SECONDS });
  } catch {
    return NextResponse.json(
      { message: "Could not issue an API token." },
      { status: 500 },
    );
  }
}
