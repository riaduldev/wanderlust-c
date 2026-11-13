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
  if (imageUrl && !/^https?:\/\/\S+$/i.test(imageUrl)) {
    errors.imageUrl = "Image URL must start with http:// or https://";
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
