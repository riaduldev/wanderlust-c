/**
 * Browser-side cache for the short-lived API JWT issued by POST /api/token.
 * In-memory only — a full page load fetches a fresh token on demand. Shared
 * by every client component so concurrent callers hit /api/token only once.
 */

type CachedToken = {
  token: string;
  expiresAt: number;
};

const EXPIRY_MARGIN_MS = 30_000;
const DEFAULT_TTL_SECONDS = 900;

let cached: CachedToken | null = null;
let inflight: Promise<string> | null = null;

export async function getApiJwt(): Promise<string> {
  if (cached && cached.expiresAt - Date.now() > EXPIRY_MARGIN_MS) {
    return cached.token;
  }

  if (!inflight) {
    inflight = fetch("/api/token", { method: "POST" })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as {
          token?: string;
          expiresIn?: number;
          message?: string;
        } | null;

        if (!response.ok || !data?.token) {
          throw new Error(
            data?.message ?? "Your session has expired. Please sign in again.",
          );
        }

        cached = {
          token: data.token,
          expiresAt: Date.now() + (data.expiresIn ?? DEFAULT_TTL_SECONDS) * 1000,
        };
        return data.token;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return await inflight;
}

/** Drop the cached token (called on sign-out so it cannot be reused). */
export function clearApiJwt(): void {
  cached = null;
}
