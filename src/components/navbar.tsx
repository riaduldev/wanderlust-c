"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

import { useSession } from "@/app/api/auth/[...all]/auth-client";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";

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
  const { data: session, isPending } = useSession();
  const user = session?.user;

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

        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
          {isPending ? null : user ? (
            <Link
              href="/profile"
              aria-label="Your profile"
              className={
                isActive(pathname, "/profile")
                  ? "flex items-center gap-2 rounded-full bg-brand/10 px-2 py-1 text-brand transition-colors"
                  : "flex items-center gap-2 rounded-full px-2 py-1 text-foreground/90 transition-colors hover:bg-muted hover:text-brand"
              }
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                <User className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden max-w-32 truncate text-[15px] sm:inline">
                {user.name}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-foreground/90 hover:text-brand text-[15px] transition-colors"
              >
                Sign In
              </Link>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                className="rounded-lg bg-brand px-4 text-white hover:bg-brand-dark"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
