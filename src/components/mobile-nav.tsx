"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
};

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

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
        <div
          key={pathname}
          className="bg-background absolute inset-x-0 top-full z-50 border-b border-border shadow-lg"
        >
          <nav className="mx-auto flex w-full max-w-[1400px] flex-col px-4 py-3 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={
                  isActive(link.href)
                    ? "text-brand border-brand border-l-2 py-3 pl-3 text-[15px]"
                    : "text-foreground/90 hover:text-brand border-transparent border-l-2 py-3 pl-3 text-[15px] transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="text-foreground/90 hover:text-brand border-transparent border-l-2 py-3 pl-3 text-[15px] transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
