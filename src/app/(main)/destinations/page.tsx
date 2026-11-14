import DestinationsExplorer from "@/components/destinations/DestinationsExplorer";
import { getDestinations } from "@/lib/destinations-api";
import type { Destination } from "@/types/destination";

const AllDestinationsPage = async () => {
  // An unreachable API should not take the whole catalogue page down;
  // the grid's empty state covers it.
  const destinations: Destination[] = await getDestinations().catch(() => []);

  return (
    <main className="min-h-screen bg-white">
      <DestinationsExplorer destinations={destinations} />
    </main>
  );
};

export default AllDestinationsPage;
