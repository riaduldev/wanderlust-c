"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, Hash, MapPin, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";
import { FALLBACK_DESTINATION_IMAGES } from "@/lib/fallback-images";
import { useBookings } from "@/hooks/use-bookings";
import { formatDepartureDate, type Booking } from "@/lib/bookings";

export function BookingsList() {
  const { bookings, cancel } = useBookings();

  function handleCancel(booking: Booking) {
    cancel(booking.id);
    toast.add({
      title: "Booking cancelled",
      description: `${booking.destinationName} was removed from your bookings.`,
      type: "info",
    });
  }

  if (bookings.length === 0) {
    return (
      <Empty className="border-border border-dashed">
        <EmptyHeader>
          <EmptyMedia>
            <CalendarDays className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No bookings yet</EmptyTitle>
          <EmptyDescription>
            Browse the destinations and book your next trip.
          </EmptyDescription>
        </EmptyHeader>
        <Button
          nativeButton={false}
          className="bg-brand hover:bg-brand-dark text-white"
          render={<Link href="/destinations">Explore destinations</Link>}
        />
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking, index) => (
        <BookingRow
          key={booking.id}
          booking={booking}
          fallbackImage={
            FALLBACK_DESTINATION_IMAGES[index % FALLBACK_DESTINATION_IMAGES.length]
          }
          onCancel={() => handleCancel(booking)}
        />
      ))}
    </div>
  );
}

function BookingRow({
  booking,
  fallbackImage,
  onCancel,
}: {
  booking: Booking;
  fallbackImage: string;
  onCancel: () => void;
}) {
  const [image, setImage] = useState(booking.imageUrl || fallbackImage);
  const [open, setOpen] = useState(false);

  return (
    <article className="bg-card flex flex-col gap-4 rounded-xl border border-border/70 p-3 shadow-sm transition-shadow duration-300 hover:shadow-md sm:flex-row sm:items-center">
      <div className="bg-muted relative h-36 w-full shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-48">
        <Image
          src={image}
          alt={booking.destinationName}
          fill
          sizes="(max-width: 640px) 100vw, 192px"
          className="object-cover"
          onError={() => setImage(fallbackImage)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Badge
          variant="outline"
          className={`w-fit gap-1 rounded-full ${
            booking.status === "Confirmed"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {booking.status}
        </Badge>

        <h3 className="font-heading truncate text-lg font-semibold">
          {booking.destinationName}
        </h3>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Departure: {formatDepartureDate(booking.departureDate)}
          </span>
          {booking.country ? (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {booking.country}
            </span>
          ) : null}
          <span className="flex items-center gap-1.5">
            <Hash className="size-3.5" />
            Booking ID: {booking.id}
          </span>
        </div>

        <p className="font-heading text-brand mt-1 text-2xl font-bold">
          ${booking.price.toLocaleString("en-US")}
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 sm:self-center">
        <Button
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onCancel}
        >
          <Trash2 />
          Cancel
        </Button>
        <Button
          className="bg-brand text-white hover:bg-brand-dark"
          onClick={() => setOpen(true)}
        >
          <Eye />
          View
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{booking.destinationName}</DialogTitle>
            <DialogDescription>
              Booking {booking.id} · {booking.status}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted relative h-48 w-full overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={booking.destinationName}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
              onError={() => setImage(fallbackImage)}
            />
          </div>

          <dl className="grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Departure</dt>
              <dd className="font-medium">
                {formatDepartureDate(booking.departureDate)}
              </dd>
            </div>
            {booking.duration ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium">{booking.duration}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Booking ID</dt>
              <dd className="font-mono text-xs">{booking.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Total price</dt>
              <dd className="font-heading text-brand text-lg font-bold">
                ${booking.price.toLocaleString("en-US")}
              </dd>
            </div>
          </dl>

          {booking.description ? (
            <p className="text-muted-foreground text-sm">{booking.description}</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </article>
  );
}
