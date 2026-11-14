import DestinationsGrid from "@/components/destinations/DestinationsGrid";
import type { Destination } from "@/types/destination";

export default function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-normal tracking-tight text-gray-900">
          Explore All Destinations
        </h1>

        <p className="mt-2 text-xs text-gray-500">
          Find your perfect travel experience from our curated collection
        </p>
      </div>

      <DestinationsGrid destinations={destinations} />
    </section>
  );
}
