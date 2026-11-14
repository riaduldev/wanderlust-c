
import { notFound } from "next/navigation";

import { getDestinationById } from "@/lib/destinations-api";
import EditDestinationForm from "@/components/destinations/EditDestinationForm";


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDestinationPage({
  params,
}: PageProps) {
  const { id } = await params;

  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Edit Destination
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update your destination information below.
        </p>
      </div>

      <EditDestinationForm destination={destination} />
    </section>
  );
}
