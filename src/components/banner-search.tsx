"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const fieldClassName =
  "text-white placeholder:text-white/70 focus-visible:ring-brand mt-1 w-full bg-transparent text-sm outline-none";

export function BannerSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = [location, date]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(" ");

    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }

    const maxPrice = Number.parseInt(budget, 10);
    if (Number.isFinite(maxPrice) && maxPrice > 0) {
      params.set("maxPrice", String(maxPrice));
    }

    const search = params.toString();
    router.push(search ? `/destinations?${search}` : "/destinations");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
    >
      <div className="bg-black/10 px-6 py-4">
        <label htmlFor="search-location" className="text-white block text-base">
          Location
        </label>
        <input
          id="search-location"
          name="location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Address, City Or Zip"
          className={fieldClassName}
        />
      </div>

      <div className="bg-black/10 px-6 py-4">
        <label htmlFor="search-date" className="text-white block text-base">
          Date/Duration
        </label>
        <input
          id="search-date"
          name="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          placeholder="Anytime/3 Days"
          className={fieldClassName}
        />
      </div>

      <div className="bg-black/10 px-6 py-4">
        <label htmlFor="search-budget" className="text-white block text-base">
          Budget
        </label>
        <input
          id="search-budget"
          name="budget"
          type="number"
          min={0}
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          placeholder="Any budget"
          className={fieldClassName}
        />
      </div>

      <Button
        type="submit"
        className="bg-brand hover:bg-brand-dark text-white min-h-14 rounded-none px-10 text-sm font-medium tracking-[0.12em] uppercase sm:col-span-2 lg:col-span-1"
      >
        Search
      </Button>
    </form>
  );
}
