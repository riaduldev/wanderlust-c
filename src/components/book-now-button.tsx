"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useBookings } from "@/hooks/use-bookings";
import type { Destination } from "@/types/destination";

export function BookNowButton({ destination }: { destination: Destination }) {
  const { book, bookings } = useBookings();
  const [isBooking, setIsBooking] = useState(false);

  const isBooked = bookings.some(
    (booking) => booking.destinationId === destination._id,
  );

  function handleBook() {
    setIsBooking(true);
    const booking = book(destination);
    setIsBooking(false);

    toast.add({
      title: "Booking confirmed",
      description: `${destination.destinationName} was added as booking ${booking.id}.`,
      type: "success",
    });
  }

  if (isBooked) {
    return (
      <Button
        variant="outline"
        className="border-brand/40 text-brand hover:bg-brand/10 hover:text-brand"
        render={
          <Link href="/bookings">
            <Check />
            Booked
          </Link>
        }
      />
    );
  }

  return (
    <Button
      className="bg-brand hover:bg-brand-dark text-white"
      onClick={handleBook}
      disabled={isBooking}
    >
      {isBooking ? <Loader2 className="animate-spin" /> : null}
      Book now
    </Button>
  );
}
