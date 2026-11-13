"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  BOOKINGS_STORAGE_KEY,
  addBooking,
  removeBooking,
  writeBookings,
  type Booking,
} from "@/lib/bookings";
import type { Destination } from "@/types/destination";

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
}

export function useBookings() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const bookings = useMemo<Booking[]>(() => {
    if (!raw) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Booking[]) : [];
    } catch {
      return [];
    }
  }, [raw]);

  const book = useCallback((destination: Destination) => {
    const booking = addBooking(destination);
    emitChange();
    return booking;
  }, []);

  const cancel = useCallback((id: string) => {
    removeBooking(id);
    emitChange();
  }, []);

  const replaceAll = useCallback((next: Booking[]) => {
    writeBookings(next);
    emitChange();
  }, []);

  return { bookings, book, cancel, replaceAll };
}
