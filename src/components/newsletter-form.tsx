"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { toast } from "@/components/ui/toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    toast.add({
      title: "You're on the list",
      description: `We will send travel deals to ${email.trim()}.`,
      type: "success",
    });

    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-5 w-full max-w-[320px]">
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter email"
        aria-label="Email address"
        className="bg-white/10 placeholder:text-white/80 focus-visible:ring-brand/60 h-12 w-full rounded-none px-4 pr-12 text-sm text-white outline-none transition-colors focus-visible:ring-2"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="text-white hover:text-brand absolute right-0 top-0 flex h-12 w-12 items-center justify-center transition-colors"
      >
        <ArrowUpRight className="size-5" />
      </button>
    </form>
  );
}
