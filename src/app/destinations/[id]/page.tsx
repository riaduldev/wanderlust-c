import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";

import { BookNowButton } from "@/components/book-now-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDestinationById } from "@/lib/destinations-api";
import { formatDepartureDate } from "@/lib/bookings";

export default function DestinationDetailPage({
  params,
}: PageProps<"/destinations/[id]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <DestinationDetail params={params} />
    </Suspense>
  );
}

async function DestinationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/destinations"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to destinations
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden rounded-xl">
          <Image
            src={destination.imageUrl || "/images/destinations/image1.png"}
            alt={destination.destinationName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Badge
            variant="outline"
            className="text-brand border-brand/30 bg-brand/10 w-fit gap-1 rounded-full"
          >
            <Tag />
            {destination.category}
          </Badge>

          <h1 className="font-heading text-3xl font-semibold">
            {destination.destinationName}
          </h1>

          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" />
              {destination.country}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="size-4" />
              Departure: {formatDepartureDate(destination.departureDate)}
            </span>
            <span className="flex items-center gap-2">
              <Tag className="size-4" />
              {destination.duration}
            </span>
          </div>

          <p className="text-muted-foreground text-sm">
            {destination.description}
          </p>

          <div className="border-border mt-2 flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-muted-foreground text-xs">Price per person</p>
              <p className="font-heading text-brand text-3xl font-bold">
                ${destination.price.toLocaleString("en-US")}
              </p>
            </div>

            <BookNowButton destination={destination} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[16/10] w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </section>
  );
}
