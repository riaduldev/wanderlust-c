import { AddTravelPackageForm } from "@/components/add-travel-package-form";

export default function AddDestinationsPage() {
  return (
    <div className="bg-background w-full">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 animate-rise-in sm:px-6 lg:px-10">
        <h1 className="font-heading text-foreground font-light text-3xl">
          Add New Travel Package
        </h1>

        <AddTravelPackageForm />
      </div>
    </div>
  );
}
