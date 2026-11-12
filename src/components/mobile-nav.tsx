"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
  active: boolean;
};

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="text-foreground hover:text-brand -ml-2 inline-flex size-10 items-center justify-center transition-colors"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open ? (
        <div className="bg-background absolute inset-x-0 top-full z-50 border-b border-border shadow-lg">
          <nav className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-3 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={
                  link.active
                    ? "text-brand border-l-2 border-brand py-3 pl-3 text-[15px]"
                    : "text-foreground/90 hover:text-brand border-l-2 border-transparent py-3 pl-3 text-[15px] transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#profile"
              onClick={() => setOpen(false)}
              className="text-foreground/90 hover:text-brand border-l-2 border-transparent py-3 pl-3 text-[15px] transition-colors"
            >
              Profile
            </Link>
            <Link
              href="#login"
              onClick={() => setOpen(false)}
              className="text-foreground/90 hover:text-brand border-l-2 border-transparent py-3 pl-3 text-[15px] transition-colors"
            >
              Login
            </Link>
            <Link
              href="#signup"
              onClick={() => setOpen(false)}
              className="text-foreground/90 hover:text-brand border-l-2 border-transparent py-3 pl-3 text-[15px] transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
