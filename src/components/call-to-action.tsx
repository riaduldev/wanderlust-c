import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="bg-muted relative isolate w-full overflow-hidden">
      <Image
        src="/images/CTA.png"
        alt="A plane flying over a tropical island"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="-z-10 absolute inset-0 bg-black/50" />
      <div className="-z-10 absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_15%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[1344px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <h2 className="font-heading text-white font-light text-[2rem] leading-tight sm:text-[2.75rem] lg:text-[3rem]">
          Ready To Start Your Journey?
        </h2>

        <p className="text-white/90 mt-5 max-w-2xl text-base sm:mt-6 sm:text-lg">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Button className="bg-background text-foreground hover:bg-background/90 mt-8 h-14 w-full rounded-none px-8 text-sm font-medium tracking-[0.12em] uppercase sm:mt-10 sm:w-auto sm:px-10">
          Book Your Trip Today
          <ArrowRight className="ml-3 size-4" />
        </Button>
      </div>
    </section>
  );
}
