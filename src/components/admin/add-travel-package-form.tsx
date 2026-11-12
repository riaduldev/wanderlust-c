"use client";

import * as React from "react";
import { Save, Trash2 } from "lucide-react";

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

const categories = [
  "Beach",
  "Mountain",
  "City Break",
  "Adventure",
  "Cultural",
  "Desert",
  "Island",
  "Wildlife",
];

const fieldClassName =
  "h-9 rounded-md border-transparent bg-muted/60 placeholder:text-muted-foreground";

export function AddTravelPackageForm() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [category, setCategory] = React.useState("Beach");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast.add({
      title: "Travel package added",
      description: "The new package is now available in your catalogue.",
      type: "success",
    });

    formRef.current?.reset();
    setCategory("Beach");
  }

  function handleCancel() {
    formRef.current?.reset();
    setCategory("Beach");

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
                {categories.map((item) => (
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
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-full rounded-none sm:w-auto"
        >
          <Trash2 className="size-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-brand hover:bg-brand-dark text-white h-9 w-full rounded-none sm:w-auto"
        >
          <Save className="size-4" />
          Add Travel Package
        </Button>
      </div>
    </form>
  );
}
