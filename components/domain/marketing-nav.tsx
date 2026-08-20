"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Logo } from "@/components/domain/logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/patterns", label: "Patterns" },
  { href: "/community", label: "Community" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-[var(--duration-base)]",
        scrolled
          ? "border-b border-border-subtle bg-surface-raised/72 shadow-[var(--shadow-xs)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Crochelia home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-pink-50 hover:text-text-brand"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/sign-up">Start creating</Link>
          </Button>
        </div>

        <button
          className="p-2 text-text-primary md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border-subtle bg-surface-raised px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-text-secondary hover:bg-pink-50 hover:text-text-brand"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border-subtle pt-3">
              <Button variant="secondary" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button variant="primary" asChild>
                <Link href="/sign-up">Start creating</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
