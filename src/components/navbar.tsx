"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

import { MobileNav } from "@/components/mobile-nav";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Add Destinations", href: "/add-destinations" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur">
      <div className="relative mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <nav className="hidden flex-1 items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={
                isActive(pathname, link.href)
                  ? "text-brand text-[15px] underline underline-offset-[6px]"
                  : "text-foreground/90 hover:text-brand text-[15px] transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center lg:hidden">
          <MobileNav links={navLinks} />
        </div>

        <Link
          href="/"
          aria-label="Wanderlast home"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Image
            src="/images/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            priority
            className="h-5 w-auto sm:h-6"
          />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-5 sm:gap-7">
          <Link
            href="/admin"
            aria-current={isActive(pathname, "/admin") ? "page" : undefined}
            className="text-foreground/90 hover:text-brand flex items-center gap-2 text-[15px] transition-colors"
          >
            <User className="size-[18px]" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
