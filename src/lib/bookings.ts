import type { Destination } from "@/types/destination";

export type BookingStatus = "Confirmed" | "Pending";

export type Booking = {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
  status: BookingStatus;
  createdAt: string;
};

export const BOOKINGS_STORAGE_KEY = "wanderlust.bookings";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readBookings(): Booking[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

export function writeBookings(bookings: Booking[]) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // Storage can be unavailable (private mode, quota) — bookings stay in memory.
  }
}

export function addBooking(destination: Destination): Booking {
  const bookings = readBookings();
  const nextNumber =
    bookings.reduce((highest, booking) => {
      const value = Number.parseInt(booking.id.replace("b", ""), 10);
      return Number.isFinite(value) && value > highest ? value : highest;
    }, 0) + 1;

  const booking: Booking = {
    id: `b${nextNumber}`,
    destinationId: destination._id,
    destinationName: destination.destinationName,
    country: destination.country,
    category: destination.category,
    price: destination.price,
    duration: destination.duration,
    departureDate: destination.departureDate,
    imageUrl: destination.imageUrl,
    description: destination.description,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  writeBookings([booking, ...bookings]);
  return booking;
}

export function removeBooking(id: string) {
  writeBookings(readBookings().filter((booking) => booking.id !== id));
}

export function formatDepartureDate(value: string | undefined) {
  if (!value) {
    return "Not scheduled";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
