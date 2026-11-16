import { Banner } from "@/components/banner";
import { CallToAction } from "@/components/call-to-action";
import { FeaturedDestinations } from "@/components/featured-destinations";
import { Testimonials } from "@/components/testimonials";
import { WhyChooseUs } from "@/components/why-choose-us";
import { getDestinations } from "@/lib/destinations-api";
import type { Destination } from "@/types/destination";

const FEATURED_COUNT = 5;

async function getFeaturedDestinations(): Promise<Destination[]> {
  try {
    const destinations = await getDestinations();
    return destinations.slice(0, FEATURED_COUNT);
  } catch (error) {
    // Express down / JWT misconfigured — hide the section, keep the home page up.
    console.error("Could not load featured destinations:", error);
    return [];
  }
}

export default async function Home() {
  const featured = await getFeaturedDestinations();

  return (
    <>
      <Banner />
      {featured.length > 0 ? (
        <FeaturedDestinations destinations={featured} />
      ) : null}
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </>
  );
}
