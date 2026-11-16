import { SignJWT, jwtVerify } from "jose";

/**
 * Shared HS256 JWT layer for API auth (not for page sessions — pages keep
 * the two-layer better-auth cookie protection in proxy.ts / require-session).
 * Both this app and the Express API (wanderlust-s) verify tokens with the
 * same `JWT_SECRET` env var and the same `wanderlust` issuer.
 */

const ISSUER = "wanderlust";

export type ApiJwtClaims = {
  sub: string;
  typ: "user" | "service";
  email?: string;
  name?: string;
};

// Lazy so `next build` never evaluates a missing secret at module load.
function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set in .env — API tokens cannot be signed.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signApiJwt(
  claims: ApiJwtClaims,
  expiresIn: string,
): Promise<string> {
  return await new SignJWT({
    typ: claims.typ,
    email: claims.email,
    name: claims.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecretKey());
}

export async function verifyApiJwt(token: string): Promise<ApiJwtClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
    });

    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      return null;
    }
    if (payload.typ !== "user" && payload.typ !== "service") {
      return null;
    }

    return {
      sub: payload.sub,
      typ: payload.typ,
      email: typeof payload.email === "string" ? payload.email : undefined,
      name: typeof payload.name === "string" ? payload.name : undefined,
    };
  } catch {
    return null;
  }
}

/** Reads and verifies an `Authorization: Bearer <jwt>` header. */
export async function verifyRequestJwt(
  request: Request,
): Promise<ApiJwtClaims | null> {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return verifyApiJwt(header.slice(7).trim());
}
