import { signApiJwt } from "@/lib/jwt";
import type { Destination } from "@/types/destination";

// Prefer the server-only var, then the public one (set on Vercel), then local.
const DESTINATIONS_API_URL =
  process.env.DESTINATIONS_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

// SSR fetches have no browser session, so they authenticate to the Express
// API with a short-lived service JWT signed with the shared JWT_SECRET.
// Throws (fail-closed) when JWT_SECRET is missing.
async function serviceAuthHeaders(): Promise<Record<string, string>> {
  const token = await signApiJwt({ sub: "service", typ: "service" }, "5m");
  return { Authorization: `Bearer ${token}` };
}

function toDestinationList(payload: unknown): Destination[] {
  if (Array.isArray(payload)) {
    return payload as Destination[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    for (const key of ["destinations", "packages", "data", "results"]) {
      const value = record[key];
      if (Array.isArray(value)) {
        return value as Destination[];
      }
    }

    if (record.destinationName !== undefined || record._id !== undefined) {
      return [record as unknown as Destination];
    }
  }

  return [];
}

export async function getDestinations(): Promise<Destination[]> {
  const response = await fetch(`${DESTINATIONS_API_URL}/destinations`, {
    cache: "no-store",
    headers: await serviceAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Could not load destinations (${response.status}).`);
  }

  const payload = await response.json();
  return toDestinationList(payload);
}

export async function getDestinationById(
  id: string,
): Promise<Destination | undefined> {
  const destinations = await getDestinations();
  return destinations.find((destination) => destination._id === id);
}
