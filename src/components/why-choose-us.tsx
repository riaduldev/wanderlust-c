import Image from "next/image";

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-brand/10 w-full py-20 lg:py-28">
      <div className="mx-auto w-full max-w-[1344px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-foreground font-light text-[2.25rem] leading-tight sm:text-[3rem]">
            Why Choose Wanderlust
          </h2>
          <p className="text-muted-foreground mt-4 text-base sm:text-lg">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="bg-background border-border/60 flex flex-col p-8 lg:p-10"
            >
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="size-9"
              />
              <h3 className="font-heading text-foreground mt-7 text-2xl font-medium">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
