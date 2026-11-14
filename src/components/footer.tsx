import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Add Destinations", href: "/add-destinations" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2H22l-7.1 8.1L23.3 22h-6.6l-5.2-6.8L5.6 22H2.5l7.6-8.7L1.7 2h6.8l4.7 6.2L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
    </svg>
  );
}

function LinkedInIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8.16h4.56V23H.22V8.16Zm7.68 0h4.37v2.99h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 6.99V23h-4.55v-6.26c0-1.49-.03-3.41-2.08-3.41-2.08 0-2.4 1.63-2.4 3.3V23H7.9V8.16Z" />
    </svg>
  );
}

function InstagramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-footer text-white w-full">
      <div className="mx-auto w-full max-w-[1344px] px-4 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <Image
          src="/images/Wanderlast-1.png"
          alt="Wanderlast"
          width={542}
          height={80}
          className="w-[200px] sm:w-[300px] lg:w-[380px] xl:w-[542px]"
        />

        <p className="text-white/85 mt-6 max-w-xl text-sm sm:text-base">
          Your gateway to extraordinary travel experiences around the world.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <h3 className="text-[15px] tracking-[0.02em]">NEWSLETTER</h3>
            <p className="text-white/70 mt-3 text-[13px]">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <NewsletterForm />
          </div>

          <div>
            <h3 className="text-[15px] tracking-[0.02em]">QUICK LINKS</h3>
            <ul className="mt-5 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/85 hover:text-brand text-sm transition-colors sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[15px] tracking-[0.02em]">SUPPORT</h3>
            <ul className="mt-5 space-y-4">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/85 hover:text-brand text-sm transition-colors sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[15px] tracking-[0.02em]">CONTACT US</h3>
            <ul className="mt-5 space-y-4">
              <li className="text-white/85 text-sm sm:text-base">
                <a href="tel:7869011622">786 901 1622</a>
              </li>
              <li className="text-white/85 text-sm sm:text-base">
                <a href="mailto:info@wandarland.com">info@wandarland.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-white/15 mt-14 flex flex-col gap-5 border-t py-6 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p className="text-white/70 text-xs sm:text-sm">
            © 2026 Wanderlust. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="X"
              className="text-white hover:text-brand transition-colors"
            >
              <XIcon className="size-[18px]" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="text-white hover:text-brand transition-colors"
            >
              <LinkedInIcon className="size-[18px]" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="text-white hover:text-brand transition-colors"
            >
              <InstagramIcon className="size-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
