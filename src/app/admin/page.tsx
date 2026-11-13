import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Plus, Tag, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDestinations } from "@/lib/destinations-api";
import { formatDepartureDate } from "@/lib/bookings";

export default function AdminPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">
            Manage travel packages
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            An overview of every package in the catalogue.
          </p>
        </div>

        <Button
          className="bg-brand hover:bg-brand-dark text-white"
          render={
            <Link href="/add-destinations">
              <Plus />
              Add package
            </Link>
          }
        />
      </header>

      <Suspense fallback={<AdminSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </section>
  );
}

async function AdminDashboard() {
  const destinations = await getDestinations();

  const categories = new Set(
    destinations.map((destination) => destination.category).filter(Boolean),
  );

  const averagePrice = destinations.length
    ? Math.round(
        destinations.reduce((total, item) => total + item.price, 0) /
          destinations.length,
      )
    : 0;

  const stats = [
    { label: "Packages", value: destinations.length, icon: Package },
    { label: "Categories", value: categories.size, icon: Tag },
    { label: "Average price", value: `$${averagePrice.toLocaleString("en-US")}`, icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card flex items-center gap-4 rounded-xl border border-border/70 p-5"
          >
            <span className="bg-brand/10 text-brand flex size-11 items-center justify-center rounded-lg">
              <stat.icon className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="font-heading text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card overflow-hidden rounded-xl border border-border/70">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Package
              </th>
              <th scope="col" className="hidden px-5 py-3 font-medium sm:table-cell">
                Category
              </th>
              <th scope="col" className="hidden px-5 py-3 font-medium md:table-cell">
                Departure
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Price
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((destination, index) => (
              <tr key={destination._id} className="border-border/70 border-t">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={
                          destination.imageUrl ||
                          `/images/destinations/image${(index % 6) + 1}.png`
                        }
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {destination.destinationName}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {destination.country}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3 sm:table-cell">
                  <Badge variant="outline" className="rounded-full">
                    {destination.category}
                  </Badge>
                </td>
                <td className="text-muted-foreground hidden px-5 py-3 md:table-cell">
                  {formatDepartureDate(destination.departureDate)}
                </td>
                <td className="px-5 py-3 text-right font-medium">
                  ${destination.price.toLocaleString("en-US")}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/destinations/${destination._id}`}
                    aria-label={`View ${destination.destinationName}`}
                    className="text-brand hover:text-brand-dark inline-flex items-center gap-1 text-xs font-medium tracking-wider uppercase"
                  >
                    View
                    <ArrowRight className="size-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
