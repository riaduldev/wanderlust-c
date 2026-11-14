"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, Star } from "lucide-react";

import type { Destination } from "@/types/destination";

interface DestinationCardProps {
  destination: Destination;
  fallbackImage: string;
}

export function DestinationCard({
  destination,
  fallbackImage,
}: DestinationCardProps) {
  const [image, setImage] = useState(destination.imageUrl || fallbackImage);

  return (
    <article className="group flex flex-col">
      <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={destination.destinationName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImage(fallbackImage)}
        />

        {destination.rating !== undefined ? (
          <div className="bg-background/95 absolute right-3 top-3 flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <span>{destination.rating.toFixed(1)}</span>
            <Star className="fill-foreground size-3 text-foreground" />
          </div>
        ) : null}
      </div>

      <div className="mt-3.5 flex flex-col">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{destination.country}</span>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-2">
          <h3 className="font-heading truncate text-lg font-medium">
            {destination.destinationName}
          </h3>
          <div className="shrink-0 text-right">
            <span className="font-heading text-lg font-medium">
              ${destination.price.toLocaleString("en-US")}
            </span>
            <span className="text-muted-foreground text-[11px]">/Person</span>
          </div>
        </div>

        <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
          <Calendar className="size-3.5 shrink-0" />
          <span className="truncate">{destination.duration}</span>
        </div>

        <div className="mt-4">
          <Link
            href={`/destinations/${destination._id}`}
            className="text-brand hover:text-brand-dark inline-flex items-center gap-1 text-xs font-medium tracking-wider uppercase transition-colors"
          >
            <span>Book Now</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
