import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/**
 * Fail-closed server-side session gate. `src/proxy.ts` only checks that a
 * session cookie exists (a forged or expired cookie passes it); this call
 * validates the session against the database. On any failure it redirects
 * to /sign-in with a same-site `next` path, matching the proxy's scheme.
 */
export async function requireSession(nextPath: string): Promise<void> {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session) {
    const params = new URLSearchParams({ next: nextPath });
    redirect(`/sign-in?${params.toString()}`);
  }
}
