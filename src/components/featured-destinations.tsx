"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calendar, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { FALLBACK_DESTINATION_IMAGES } from "@/lib/fallback-images";
import type { Destination } from "@/types/destination";

function fallbackFor(index: number): string {
  return FALLBACK_DESTINATION_IMAGES[index % FALLBACK_DESTINATION_IMAGES.length];
}

function FeaturedCard({
  destination,
  fallbackIndex,
}: {
  destination: Destination;
  fallbackIndex: number;
}) {
  const [image, setImage] = useState(
    destination.imageUrl || fallbackFor(fallbackIndex),
  );

  return (
    <article className="group flex flex-col">
      <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={destination.destinationName}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 31vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImage(fallbackFor(fallbackIndex))}
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

export function FeaturedDestinations({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(destinations.length);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const progress =
    snapCount > 0 ? ((activeIndex + 1) / snapCount) * 100 : 0;

  return (
    <section className="bg-background animate-rise-in w-full py-20 lg:py-28">
      {/* Controls read carousel context, so everything (header + content +
          footer) must live inside <Carousel>, like testimonials.tsx. */}
      <Carousel
        opts={{ align: "start", loop: false }}
        setApi={setApi}
        className="w-full"
      >
        <div className="mx-auto w-full max-w-[1344px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-foreground font-light text-[2.25rem] leading-tight sm:text-[3rem]">
                Featured Destinations
              </h2>
              <p className="text-muted-foreground mt-3 text-base">
                Handpicked travel experiences for the adventure seekers
              </p>
            </div>

            <Button
              variant="outline"
              nativeButton={false}
              className="h-11 gap-2 rounded-none px-6 text-sm font-medium tracking-[0.12em] uppercase"
              render={
                <Link href="/destinations">
                  All Destinations
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
          </div>

          <CarouselContent className="mt-10 lg:mt-12">
            {destinations.map((destination, index) => (
              <CarouselItem
                key={destination._id}
                className="basis-[85%] sm:basis-1/2 lg:basis-[31%]"
              >
                <FeaturedCard
                  destination={destination}
                  fallbackIndex={index}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex items-center gap-4 sm:gap-6">
            <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
              {activeIndex + 1}/{snapCount}
            </span>

            <div className="bg-border relative h-0.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-foreground/70 absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <CarouselPrevious className="static size-11 rounded-full sm:size-12" />
              <CarouselNext className="static size-11 rounded-full sm:size-12" />
            </div>
          </div>
        </div>
      </Carousel>
    </section>
  );
}
