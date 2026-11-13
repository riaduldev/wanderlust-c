import type { Destination } from "@/types/destination";

const DESTINATIONS_API_URL =
  process.env.DESTINATIONS_API_URL ?? "http://localhost:8000";

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
