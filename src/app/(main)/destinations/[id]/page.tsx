
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Tag,
  Check,
  X,
} from "lucide-react";

import { BookNowButton } from "@/components/book-now-button";
import { DestinationHeroImage } from "@/components/destinations/destination-hero-image";
import { Skeleton } from "@/components/ui/skeleton";

import { getDestinationById } from "@/lib/destinations-api";
import { formatDepartureDate } from "@/lib/bookings";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DestinationDetailPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <DestinationDetail params={params} />
    </Suspense>
  );
}

async function DestinationDetail({
  params,
}: PageProps) {
  const { id } = await params;

  const destination = await getDestinationById(id);

  if (!destination) {
    notFound();
  }

  const price = Number(destination.price);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 animate-rise-in sm:px-6 lg:px-8">

      {/* Top Navigation */}
      <div className="mb-4 flex items-center justify-between">

        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-xs text-gray-500 transition hover:text-cyan-600"
        >
          <ArrowLeft size={14} />
          Back to Destinations
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">

          <Link
            href={`/destinations/${id}/edit`}
            className="inline-flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-100"
          >
            <Pencil size={12} />
            Edit
          </Link>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 border border-red-300 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
          >
            <X size={13} />
            Cancel
          </Link>

        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[230px] w-full overflow-hidden bg-gray-100 sm:h-[320px] lg:h-[400px]">
        <DestinationHeroImage
          src={destination.imageUrl || "/images/destinations/image1.png"}
          alt={destination.destinationName}
          fallbackSrc="/images/destinations/image1.png"
        />
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

        {/* Left Content */}
        <div>

          {/* Country */}
          <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} />
            {destination.country}
          </div>

          {/* Destination Name */}
          <h1 className="text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl">
            {destination.destinationName}
          </h1>

          {/* Destination Information */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">

            <span className="flex items-center gap-1.5">
              <Tag size={13} className="text-cyan-600" />
              {destination.category}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {destination.duration}
            </span>

            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />
              {formatDepartureDate(destination.departureDate)}
            </span>

          </div>

          {/* Overview */}
          <div className="mt-6">

            <h2 className="mb-2 text-lg font-medium text-gray-900">
              Overview
            </h2>

            <p className="max-w-3xl text-sm leading-6 text-gray-500">
              {destination.description}
            </p>

          </div>

          {/* Highlights */}
          <div className="mt-6">

            <h2 className="mb-3 text-lg font-medium text-gray-900">
              Highlights
            </h2>

            <div className="grid grid-cols-1 gap-3 text-xs text-gray-600 sm:grid-cols-2">

              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Explore {destination.destinationName}
              </div>

              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Discover local attractions
              </div>

              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Experience {destination.country}
              </div>

              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Enjoy your {destination.duration} trip
              </div>

            </div>

          </div>

        </div>

        {/* Right Booking Card */}
        <aside className="h-fit border border-gray-200 bg-white p-5 shadow-sm">

          <p className="text-xs text-gray-500">
            Starting from
          </p>

          <h2 className="mt-1 text-3xl font-semibold text-cyan-600">
            ${Number.isFinite(price) ? price.toLocaleString("en-US") : "N/A"}
          </h2>

          <p className="text-xs text-gray-400">
            per person
          </p>

          {/* Departure Date */}
          <div className="mt-5 flex items-center gap-2 bg-gray-50 px-3 py-3 text-xs text-gray-600">
            <CalendarDays size={14} />
            {formatDepartureDate(destination.departureDate)}
          </div>

          {/* Booking Button */}
          <div className="mt-3">
            <BookNowButton destination={destination} />
          </div>

          {/* Booking Benefits */}
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">

            <p className="flex items-center gap-2 text-[11px] text-gray-500">
              <Check size={13} className="text-green-500" />
              Destination details available
            </p>

            <p className="flex items-center gap-2 text-[11px] text-gray-500">
              <Check size={13} className="text-green-500" />
              {destination.duration} travel experience
            </p>

            <p className="flex items-center gap-2 text-[11px] text-gray-500">
              <Check size={13} className="text-green-500" />
              Departure date provided
            </p>

          </div>

        </aside>

      </div>

    </section>
  );
}

// Loading Skeleton
function DetailSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <div className="mb-4 flex justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-7 w-32" />
      </div>

      {/* Hero Skeleton */}
      <Skeleton className="h-[230px] w-full rounded-none sm:h-[320px] lg:h-[400px]" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">

        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-56" />

          <div className="pt-4">
            <Skeleton className="mb-3 h-6 w-28" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div className="pt-3">
            <Skeleton className="mb-3 h-6 w-28" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        <div className="h-fit space-y-4 border border-gray-200 p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

      </div>
    </section>
  );
}
