import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const searchFields = [
  { label: "Location", value: "Address, City Or Zip" },
  { label: "Date/Duration", value: "Anytime/3 Days" },
  { label: "Budget", value: "$0-$30000" },
  { label: "People", value: "5-10" },
];

export function Banner() {
  return (
    <section className="bg-muted relative isolate flex min-h-[620px] flex-col overflow-hidden lg:min-h-[calc(100svh-4rem)]">
      <Image
        src="/images/Banner.png"
        alt="Aerial view of a coastal village surrounded by forest"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="-z-10 absolute inset-0 bg-black/55" />
      <div className="-z-10 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-4 pt-16 pb-10 text-center sm:px-6 lg:px-10 lg:pt-24 lg:pb-16">
        <h1 className="font-heading text-white font-light text-[2.75rem] leading-[1.08] tracking-tight sm:text-6xl lg:text-[5rem]">
          <span className="block">Discover Your</span>
          <span className="block">Next Adventure</span>
        </h1>

        <p className="text-white/90 mt-6 max-w-3xl text-base sm:mt-8 sm:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-5">
          <Button
            className="bg-brand hover:bg-brand-dark text-white h-12 w-full rounded-none px-8 text-sm font-medium tracking-[0.12em] uppercase sm:w-auto"
            size="lg"
          >
            Explore Now
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button
            variant="outline"
            className="text-white border-white/40 hover:bg-white/15 hover:text-white h-12 w-full rounded-none border bg-white/15 px-8 text-sm font-medium tracking-[0.12em] uppercase sm:w-auto"
            size="lg"
          >
            View Destination
          </Button>
        </div>
      </div>

      <div className="relative w-full bg-white/40 backdrop-blur-md">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          {searchFields.map((field, index) => (
            <div key={field.label} className="bg-black/10 px-6 py-4">
              <label
                htmlFor={`search-${index}`}
                className="text-white block text-base font-normal"
              >
                {field.label}
              </label>
              <input
                id={`search-${index}`}
                type="text"
                defaultValue={field.value}
                className="text-white/85 placeholder:text-white/85 mt-1 w-full bg-transparent text-sm outline-none"
              />
            </div>
          ))}

          <Button className="bg-brand hover:bg-brand-dark text-white min-h-14 rounded-none px-10 text-sm font-medium tracking-[0.12em] uppercase sm:col-span-2 lg:col-span-1">
            Search
          </Button>
        </div>
      </div>
    </section>
  );
}
