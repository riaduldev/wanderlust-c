import type { QueryFilter, SortOrder } from "mongoose";

import {
  TRAVEL_PACKAGE_CATEGORIES,
  TRAVEL_PACKAGE_SORTS,
  type TravelPackageCategory,
  type TravelPackageSort,
} from "@/lib/travel-package";
import type { TravelPackageDocument } from "@/models/travel-package";

export type TravelPackageFilters = {
  category?: TravelPackageCategory;
  minPrice?: number;
  maxPrice?: number;
  sort: TravelPackageSort;
};

type ParseFiltersResult =
  | { ok: true; filters: TravelPackageFilters }
  | { ok: false; message: string };

function readNumber(value: string | null): number | undefined | "invalid" {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return "invalid";
  }

  return parsed;
}

export function parseTravelPackageFilters(
  searchParams: URLSearchParams,
): ParseFiltersResult {
  const filters: TravelPackageFilters = { sort: "recommended" };

  const category = searchParams.get("category");

  if (category && category !== "all") {
    if (!TRAVEL_PACKAGE_CATEGORIES.includes(category as TravelPackageCategory)) {
      return {
        ok: false,
        message: `Unknown category "${category}". Valid categories: ${TRAVEL_PACKAGE_CATEGORIES.join(", ")}.`,
      };
    }

    filters.category = category as TravelPackageCategory;
  }

  const minPrice = readNumber(searchParams.get("minPrice"));

  if (minPrice === "invalid") {
    return { ok: false, message: "minPrice must be a positive number." };
  }

  if (minPrice !== undefined) {
    filters.minPrice = minPrice;
  }

  const maxPrice = readNumber(searchParams.get("maxPrice"));

  if (maxPrice === "invalid") {
    return { ok: false, message: "maxPrice must be a positive number." };
  }

  if (maxPrice !== undefined) {
    filters.maxPrice = maxPrice;
  }

  const sort = searchParams.get("sort");

  if (sort) {
    if (!TRAVEL_PACKAGE_SORTS.includes(sort as TravelPackageSort)) {
      return {
        ok: false,
        message: `Unknown sort "${sort}". Valid sorts: ${TRAVEL_PACKAGE_SORTS.join(", ")}.`,
      };
    }

    filters.sort = sort as TravelPackageSort;
  }

  if (
    filters.minPrice !== undefined &&
    filters.maxPrice !== undefined &&
    filters.minPrice > filters.maxPrice
  ) {
    return { ok: false, message: "minPrice cannot be greater than maxPrice." };
  }

  return { ok: true, filters };
}

export function buildTravelPackageQuery(filters: TravelPackageFilters): {
  filter: QueryFilter<TravelPackageDocument>;
  sort: Record<string, SortOrder>;
} {
  const filter: QueryFilter<TravelPackageDocument> = {};

  if (filters.category) {
    filter.category = filters.category;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filter.price = {
      ...(filters.minPrice !== undefined ? { $gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { $lte: filters.maxPrice } : {}),
    };
  }

  const sort: Record<string, SortOrder> = {};

  switch (filters.sort) {
    case "price-asc":
      sort.price = 1;
      break;
    case "price-desc":
      sort.price = -1;
      break;
    case "rating":
      sort.rating = -1;
      break;
    case "name":
      sort.destinationName = 1;
      break;
    default:
      sort.createdAt = -1;
      break;
  }

  return { filter, sort };
}
