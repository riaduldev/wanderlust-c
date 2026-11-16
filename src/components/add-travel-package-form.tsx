"use client";

import * as React from "react";
import { Loader2, Save, Trash2 } from "lucide-react";

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
import { getApiJwt } from "@/lib/api-jwt";
import {
  parseTravelPackageInput,
  TRAVEL_PACKAGE_CATEGORIES,
  type TravelPackageCategory,
  type TravelPackageInput,
} from "@/lib/travel-package";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const fieldClassName =
  "h-9 rounded-md border-transparent bg-muted/60 placeholder:text-muted-foreground";

export function AddTravelPackageForm() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [category, setCategory] = React.useState<string>("Beach");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function resetForm() {
    formRef.current?.reset();
    setCategory("Beach");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const payload: TravelPackageInput = {
        destinationName: String(formData.get("destinationName") ?? ""),
        country: String(formData.get("country") ?? ""),
        category: category as TravelPackageCategory,
        price: Number(formData.get("price") ?? 0),
        duration: String(formData.get("duration") ?? ""),
        departureDate: String(formData.get("departureDate") ?? ""),
        imageUrl: String(formData.get("imageUrl") ?? ""),
        description: String(formData.get("description") ?? ""),
      };

      const parsed = parseTravelPackageInput(payload);

      if (!parsed.ok) {
        toast.add({
          title: "Check the form",
          description:
            Object.values(parsed.errors)[0] ?? "Some fields are invalid.",
          type: "error",
        });
        return;
      }

      const token = await getApiJwt().catch(() => null);

      if (!token) {
        toast.add({
          title: "Sign in required",
          description: "Your session has expired. Please sign in again.",
          type: "error",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/add-destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.add({
          title: "Could not add the package",
          description: data?.message ?? "Please try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Travel package added",
        description: "Your package has been added successfully.",
        type: "success",
      });

      resetForm();
    } catch {
      toast.add({
        title: "Could not add the package",
        description: "The server could not be reached. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    resetForm();

    toast.add({
      title: "Form cleared",
      description: "No travel package was added.",
      type: "info",
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="border-border bg-background mx-auto mt-8 w-full max-w-[810px] border p-5 shadow-sm sm:p-7"
    >
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel htmlFor="destination-name" className="text-xs font-medium">
            Destination Name
          </FieldLabel>
          <Input
            id="destination-name"
            name="destinationName"
            placeholder="Bali Paradise"
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
              placeholder="Indonesia"
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRAVEL_PACKAGE_CATEGORIES.map((item) => (
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
              Price (USD)
            </FieldLabel>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step="1"
              placeholder="e.g., 1299"
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
              placeholder="e.g., 7 Days/6 Nights"
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
            placeholder="https://example.com/image.jpg"
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
            placeholder="Describe the travel experience.."
            required
            className="min-h-24 rounded-md border-transparent bg-muted/60 placeholder:text-muted-foreground"
          />
        </Field>
      </FieldGroup>

      <div className="border-border/70 mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-full rounded-none sm:w-auto"
        >
          <Trash2 className="size-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand hover:bg-brand-dark text-white h-9 w-full rounded-none sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSubmitting ? "Saving..." : "Add Travel Package"}
        </Button>
      </div>
    </form>
  );
}
