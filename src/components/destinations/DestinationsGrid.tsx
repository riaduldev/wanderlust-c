"use client";

import { useMemo, useState } from "react";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { FALLBACK_DESTINATION_IMAGES } from "@/lib/fallback-images";
import type { Destination } from "@/types/destination";

const selectClassName =
  "w-full rounded-none border-border bg-white px-4 py-3 text-[11px] uppercase text-muted-foreground outline-none transition-colors focus-visible:border-brand";

export default function DestinationsGrid({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(
    () => [...new Set(destinations.map((item) => item.category))],
    [destinations],
  );

  const filteredDestinations = useMemo(() => {
    let result = [...destinations];

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    if (priceRange === "low") {
      result = result.filter((item) => Number(item.price) < 500);
    } else if (priceRange === "medium") {
      result = result.filter(
        (item) =>
          Number(item.price) >= 500 && Number(item.price) <= 1500,
      );
    } else if (priceRange === "high") {
      result = result.filter((item) => Number(item.price) > 1500);
    }

    if (sortBy === "low-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "high-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        a.destinationName.localeCompare(b.destinationName),
      );
    }

    return result;
  }, [destinations, category, priceRange, sortBy]);

  function clearFilters() {
    setCategory("all");
    setPriceRange("all");
    setSortBy("default");
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-1 border border-border rounded-sm sm:grid-cols-3">
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`${selectClassName} border-b sm:border-b-0 sm:border-r`}
        >
          <option value="all">Category</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by price range"
          value={priceRange}
          onChange={(event) => setPriceRange(event.target.value)}
          className={`${selectClassName} border-b sm:border-b-0 sm:border-r`}
        >
          <option value="all">Price Range</option>
          <option value="low">Under $500</option>
          <option value="medium">$500 - $1500</option>
          <option value="high">Above $1500</option>
        </select>

        <select
          aria-label="Sort destinations"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className={selectClassName}
        >
          <option value="default">Sort By</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      <p className="mb-5 text-[11px] text-muted-foreground">
        Showing {filteredDestinations.length} destinations
      </p>

      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((destination, index) => (
            <div
              key={destination._id}
              style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
              className="animate-rise-in"
            >
              <DestinationCard
                destination={destination}
                fallbackImage={
                  FALLBACK_DESTINATION_IMAGES[
                    index % FALLBACK_DESTINATION_IMAGES.length
                  ]
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            No destinations found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try changing your filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm text-brand underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
