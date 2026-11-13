import { DestinationsExplorer } from "@/components/destinations/DestinationsExplorer";
import { Destination } from "@/types/destination";


const getDestinations = async (): Promise<Destination[]> => {
  const res = await fetch("http://localhost:8000/destinations", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch destinations");
  }

  const result = await res.json();
  // Handles both direct array `[...]` and wrapped `{ data: [...] }` responses
  return Array.isArray(result) ? result : result.data ?? [];
};

const AllDestinationsPage = async () => {
  const data = await getDestinations();

  return (
    <main className="min-h-screen bg-white">
      <DestinationsExplorer initialDestinations={data} />
    </main>
  );
};

export default AllDestinationsPage;