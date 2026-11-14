"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { TRAVEL_PACKAGE_CATEGORIES } from "@/lib/travel-package";
import type { Destination } from "@/types/destination";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DESTINATIONS_API_URL ?? "http://localhost:8000";

const fieldClassName =
  "h-9 rounded-md border-transparent bg-muted/60 placeholder:text-muted-foreground";

export default function EditDestinationForm({
  destination,
}: {
  destination: Destination;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<string>(destination.category);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep the record's current category selectable even when it is not part
  // of the shared list (e.g. legacy seeded categories like "Historical").
  const categoryOptions: string[] = (
    TRAVEL_PACKAGE_CATEGORIES as readonly string[]
  ).includes(destination.category)
    ? [...TRAVEL_PACKAGE_CATEGORIES]
    : [destination.category, ...TRAVEL_PACKAGE_CATEGORIES].filter(Boolean);

  const parsedDeparture = new Date(destination.departureDate);
  const defaultDepartureDate = Number.isNaN(parsedDeparture.getTime())
    ? ""
    : parsedDeparture.toISOString().split("T")[0];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        destinationName: String(formData.get("destinationName") ?? ""),
        country: String(formData.get("country") ?? ""),
        category,
        price: Number(formData.get("price") ?? 0),
        duration: String(formData.get("duration") ?? ""),
        departureDate: String(formData.get("departureDate") ?? ""),
        imageUrl: String(formData.get("imageUrl") ?? ""),
        description: String(formData.get("description") ?? ""),
      };

      const response = await fetch(
        `${API_BASE_URL}/update-destination/${destination._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.add({
          title: "Could not update the destination",
          description: data?.message ?? "Please try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Destination updated",
        description: `${payload.destinationName} has been saved.`,
        type: "success",
      });

      router.push(`/destinations/${destination._id}`);
      router.refresh();
    } catch {
      toast.add({
        title: "Could not update the destination",
        description: "The server could not be reached. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-background w-full rounded-xl border p-6 shadow-sm"
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="destination-name" className="text-xs font-medium">
            Destination Name
          </FieldLabel>
          <Input
            id="destination-name"
            name="destinationName"
            defaultValue={destination.destinationName}
            placeholder="Enter destination name"
            required
            className={fieldClassName}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="country" className="text-xs font-medium">
              Country
            </FieldLabel>
            <Input
              id="country"
              name="country"
              defaultValue={destination.country}
              required
              className={fieldClassName}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="category" className="text-xs font-medium">
              Category
            </FieldLabel>
            <Select
              value={category}
              onValueChange={(value) => setCategory(String(value))}
            >
              <SelectTrigger id="category" className={fieldClassName}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="price" className="text-xs font-medium">
              Price ($)
            </FieldLabel>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              defaultValue={String(destination.price ?? "")}
              required
              className={fieldClassName}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="duration" className="text-xs font-medium">
              Duration
            </FieldLabel>
            <Input
              id="duration"
              name="duration"
              defaultValue={destination.duration}
              placeholder="7 Days / 6 Nights"
              required
              className={fieldClassName}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="departure-date" className="text-xs font-medium">
            Departure Date
          </FieldLabel>
          <Input
            id="departure-date"
            name="departureDate"
            type="date"
            defaultValue={defaultDepartureDate}
            required
            className={fieldClassName}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="image-url" className="text-xs font-medium">
            Image URL
          </FieldLabel>
          <Input
            id="image-url"
            name="imageUrl"
            type="url"
            defaultValue={destination.imageUrl}
            placeholder="https://example.com/image.jpg"
            required
            className={fieldClassName}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description" className="text-xs font-medium">
            Description
          </FieldLabel>
          <Textarea
            id="description"
            name="description"
            defaultValue={destination.description}
            placeholder="Write destination description..."
            required
            className="min-h-24 resize-none rounded-md border-transparent bg-muted/60 placeholder:text-muted-foreground"
          />
        </Field>
      </FieldGroup>

      <div className="mt-6 flex flex-col-reverse gap-3 border-border/70 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          nativeButton={false}
          render={<Link href={`/destinations/${destination._id}`} />}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand text-white hover:bg-brand-dark w-full sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Updating..." : "Update Destination"}
        </Button>
      </div>
    </form>
  );
}
