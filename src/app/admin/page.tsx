import { AddTravelPackageForm } from "@/components/admin/add-travel-package-form";
import { Toaster } from "@/components/ui/toast";

export default function AdminPage() {
  return (
    <div className="bg-background w-full">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="font-heading text-foreground font-light text-3xl">
          Add New Travel Package
        </h1>

        <AddTravelPackageForm />
      </div>

      <Toaster />
    </div>
  );
}
