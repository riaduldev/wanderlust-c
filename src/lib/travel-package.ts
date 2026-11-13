export const TRAVEL_PACKAGE_CATEGORIES = [
  "Beach",
  "Mountain",
  "City Break",
  "Adventure",
  "Cultural",
  "Desert",
  "Island",
  "Wildlife",
] as const;

export type TravelPackageCategory = (typeof TRAVEL_PACKAGE_CATEGORIES)[number];

export const TRAVEL_PACKAGE_SORTS = [
  "recommended",
  "price-asc",
  "price-desc",
  "rating",
  "name",
] as const;

export type TravelPackageSort = (typeof TRAVEL_PACKAGE_SORTS)[number];

export const TRAVEL_PACKAGE_SORT_OPTIONS: ReadonlyArray<{
  value: TravelPackageSort;
  label: string;
}> = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "name", label: "Name A-Z" },
];

export const TRAVEL_PACKAGE_PRICE_RANGES: ReadonlyArray<{
  value: string;
  label: string;
}> = [
  { value: "all", label: "Any price" },
  { value: "under-1000", label: "Under $1,000" },
  { value: "1000-2000", label: "$1,000 - $2,000" },
  { value: "over-2000", label: "$2,000+" },
];

export function getPriceRangeBounds(value: string): {
  minPrice?: number;
  maxPrice?: number;
} {
  switch (value) {
    case "under-1000":
      return { maxPrice: 999 };
    case "1000-2000":
      return { minPrice: 1000, maxPrice: 2000 };
    case "over-2000":
      return { minPrice: 2000 };
    default:
      return {};
  }
}

export type TravelPackageInput = {
  destinationName: string;
  country: string;
  category: TravelPackageCategory;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

export type TravelPackageFieldErrors = Partial<
  Record<keyof TravelPackageInput, string>
>;

type ParseResult =
  | { ok: true; data: TravelPackageInput }
  | { ok: false; errors: TravelPackageFieldErrors };

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseTravelPackageInput(body: unknown): ParseResult {
  const source = (body ?? {}) as Record<string, unknown>;
  const errors: TravelPackageFieldErrors = {};

  const destinationName = readString(source.destinationName);
  if (!destinationName) {
    errors.destinationName = "Destination name is required";
  }

  const country = readString(source.country);
  if (!country) {
    errors.country = "Country is required";
  }

  const category = readString(source.category) as TravelPackageCategory;
  if (!TRAVEL_PACKAGE_CATEGORIES.includes(category)) {
    errors.category = "Pick one of the available categories";
  }

  const price = Number(source.price);
  if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be a positive number";
  }

  const duration = readString(source.duration);
  if (!duration) {
    errors.duration = "Duration is required";
  }

  const departureDate = readString(source.departureDate);
  if (!departureDate || Number.isNaN(Date.parse(departureDate))) {
    errors.departureDate = "Departure date is required";
  }

  const imageUrl = readString(source.imageUrl);
  if (imageUrl && !/^(https?:\/\/\S+|\/[^\s]*)$/i.test(imageUrl)) {
    errors.imageUrl = "Image URL must start with http://, https:// or /";
  }

  const description = readString(source.description);
  if (!description) {
    errors.description = "Description is required";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      destinationName,
      country,
      category,
      price,
      duration,
      departureDate,
      imageUrl,
      description,
    },
  };
}
