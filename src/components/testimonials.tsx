"use client";

import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Michael Chen",
    location: "Singapore",
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    image: "/images/person2.png",
  },
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    image: "/images/destinations/image4.png",
  },
  {
    name: "Emily Carter",
    location: "Sydney, Australia",
    quote:
      "Our Honeymoon In The Maldives Was Pure Bliss. The Overwater Villa Was Pristine, The Staff Went Above And Beyond, And Every Sunset Was A Memory We Will Keep Forever.",
    image: "/images/destinations/image5.png",
  },
  {
    name: "Marco Rossi",
    location: "Milan, Italy",
    quote:
      "The Amalfi Coast Route Was The Best Trip Of My Life. Winding Roads, Hidden Coves And The Most Amazing Seafood We Have Ever Tasted. Wanderlust Planned Every Single Detail.",
    image: "/images/destinations/image2.png",
  },
];

export function Testimonials() {
  return (
    <section className="bg-background w-full py-20 lg:py-28">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <div className="mx-auto w-full max-w-[1344px] px-4 sm:px-6 lg:px-8 animate-rise-in">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-heading text-foreground font-light text-[2.25rem] leading-tight sm:text-[3rem]">
                What Travelers Say
              </h2>
              <p className="text-muted-foreground mt-3 text-base">
                Real experiences from our happy travelers
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <CarouselPrevious className="static size-11 rounded-full sm:size-12" />
              <CarouselNext className="static size-11 rounded-full sm:size-12" />
            </div>
          </div>

          <CarouselContent className="mt-10 lg:mt-12">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="lg:basis-1/2"
              >
                <figure className="border-border/70 flex h-full gap-4 border p-5 sm:gap-6 sm:p-6">
                  <div className="flex flex-1 flex-col justify-between">
                    <blockquote className="font-serif text-foreground text-lg leading-snug sm:text-xl">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>

                    <figcaption className="mt-6">
                      <p className="text-brand text-[15px]">
                        <span className="text-brand/60">&mdash;</span>{" "}
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {testimonial.location}
                      </p>
                    </figcaption>
                  </div>

                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={218}
                    height={264}
                    className="h-auto w-24 shrink-0 object-cover sm:w-40 xl:w-[218px]"
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
}
