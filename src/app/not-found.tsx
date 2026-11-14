import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center animate-rise-in sm:px-6">
      <span className="bg-brand/10 text-brand flex size-14 items-center justify-center rounded-full">
        <Compass className="size-6" />
      </span>

      <p className="text-brand mt-6 text-sm font-medium tracking-[0.2em] uppercase">
        404
      </p>
      <h1 className="font-heading mt-2 text-3xl font-semibold sm:text-4xl">
        This page wandered off
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">
        The page you are looking for does not exist or has moved. Check the
        address, or continue exploring our destinations.
      </p>

      <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
        <Button
          nativeButton={false}
          className="bg-brand hover:bg-brand-dark text-white w-full sm:w-auto"
          render={
            <Link href="/">
              <ArrowLeft />
              Back to home
            </Link>
          }
        />
        <Button
          variant="outline"
          nativeButton={false}
          className="w-full sm:w-auto"
          render={<Link href="/destinations">Explore destinations</Link>}
        />
      </div>
    </section>
  );
}
