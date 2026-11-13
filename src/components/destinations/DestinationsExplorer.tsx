"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Destination } from "@/types/destination";

const PRICE_RANGES = [
  { value: "all", label: "ALL PRICES" },
  { value: "under-100", label: "UNDER $100" },
  { value: "100-1000", label: "$100 - $1,000" },
  { value: "1000-3000", label: "$1,000 - $3,000" },
  { value: "over-3000", label: "OVER $3,000" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "SORT BY: FEATURED" },
  { value: "price-asc", label: "PRICE: LOW TO HIGH" },
  { value: "price-desc", label: "PRICE: HIGH TO LOW" },
  { value: "name-asc", label: "NAME: A TO Z" },
];

const controlClassName =
  "h-12 w-full rounded-none border-0 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-none focus:ring-0";

interface DestinationsExplorerProps {
  initialDestinations: Destination[];
  initialQuery?: string;
  initialCategory?: string;
  initialMaxPrice?: number;
  initialSort?: string;
}

export function DestinationsExplorer({
  initialDestinations,
  initialQuery = "",
  initialCategory = "all",
  initialMaxPrice,
  initialSort = "featured",
}: DestinationsExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState(
    SORT_OPTIONS.some((option) => option.value === initialSort)
      ? initialSort
      : "featured",
  );
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  const categories = useMemo(() => {
    const unique = new Set(
      initialDestinations
        .map((item) => item.category?.trim())
        .filter((category): category is string => Boolean(category)),
    );
    return Array.from(unique).sort();
  }, [initialDestinations]);

  const filteredDestinations = useMemo(() => {
    const search = query.trim().toLowerCase();

    return initialDestinations
      .filter((item) => {
        if (
          category !== "all" &&
          item.category?.trim().toLowerCase() !== category.toLowerCase()
        ) {
          return false;
        }

        if (priceRange === "under-100" && item.price >= 100) return false;
        if (
          priceRange === "100-1000" &&
          (item.price < 100 || item.price > 1000)
        ) {
          return false;
        }
        if (
          priceRange === "1000-3000" &&
          (item.price < 1000 || item.price > 3000)
        ) {
          return false;
        }
        if (priceRange === "over-3000" && item.price <= 3000) return false;

        if (maxPrice !== undefined && item.price > maxPrice) return false;

        if (search) {
          const haystack = [
            item.destinationName,
            item.country,
            item.category,
            item.duration,
            item.description,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(search)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") {
          return (a.destinationName ?? "").localeCompare(
            b.destinationName ?? "",
          );
        }
        return 0;
      });
  }, [initialDestinations, category, priceRange, query, maxPrice, sortBy]);

  const hasFilters =
    query.trim() !== "" ||
    category !== "all" ||
    priceRange !== "all" ||
    maxPrice !== undefined ||
    sortBy !== "featured";

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setPriceRange("all");
    setMaxPrice(undefined);
    setSortBy("featured");
  }

  return (
    <div>
      <div className="border-border bg-background grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="SEARCH DESTINATIONS"
            aria-label="Search destinations"
            className={`${controlClassName} placeholder:text-muted-foreground pl-11`}
          />
        </div>

        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
        >
          <SelectTrigger className={controlClassName} aria-label="Category">
            <SelectValue placeholder="CATEGORY" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL CATEGORIES</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item} value={item} className="uppercase">
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priceRange}
          onValueChange={(value) => setPriceRange(value ?? "all")}
        >
          <SelectTrigger className={controlClassName} aria-label="Price range">
            <SelectValue placeholder="PRICE RANGE" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value ?? "featured")}
        >
          <SelectTrigger className={controlClassName} aria-label="Sort by">
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-3 text-xs">
        <p>
          Showing {filteredDestinations.length}{" "}
          {filteredDestinations.length === 1 ? "destination" : "destinations"}
        </p>

        {maxPrice !== undefined ? (
          <span className="bg-brand/10 text-brand inline-flex items-center gap-1 rounded-full px-2.5 py-1">
            Under ${maxPrice.toLocaleString("en-US")}
            <button
              type="button"
              onClick={() => setMaxPrice(undefined)}
              aria-label="Clear budget filter"
              className="hover:text-brand-dark"
            >
              <X className="size-3" />
            </button>
          </span>
        ) : null}

        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        ) : null}
      </div>

      {filteredDestinations.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((destination, index) => (
            <DestinationCard
              key={destination._id}
              destination={destination}
              fallbackImage={`/images/destinations/image${(index % 6) + 1}.png`}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground mt-12 rounded-md border border-dashed border-border py-16 text-center text-sm">
          No destinations found matching your selection.
        </div>
      )}
    </div>
  );
}
