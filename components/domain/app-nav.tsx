"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Sparkles } from "lucide-react";
import { Logo } from "@/components/domain/logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/projects", label: "Projects" },
  { href: "/patterns", label: "Patterns" },
  { href: "/yarn", label: "Yarn" },
  { href: "/community", label: "Community" },
  { href: "/pricing", label: "Pricing" },
];

export function AppNav({
  displayName,
  avatarUrl,
  isSeller,
}: {
  displayName: string;
  avatarUrl: string | null;
  isSeller: boolean;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-raised/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="hidden flex-1 items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-pink-50 text-text-brand"
                    : "text-text-secondary hover:bg-pink-50 hover:text-text-brand",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {isSeller && (
            <Link
              href="/business"
              className={cn(
                "rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/business")
                  ? "bg-pink-50 text-text-brand"
                  : "text-text-secondary hover:bg-pink-50 hover:text-text-brand",
              )}
            >
              Business
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            aria-label="Search"
            className="rounded-full p-2 text-text-secondary hover:bg-pink-50 hover:text-text-brand"
          >
            <Search className="size-5" />
          </button>
          <button
            aria-label="Ask the assistant"
            className="hidden rounded-full p-2 text-text-secondary hover:bg-pink-50 hover:text-text-brand sm:inline-flex"
          >
            <Sparkles className="size-5" />
          </button>
          <button
            aria-label="Notifications"
            className="rounded-full p-2 text-text-secondary hover:bg-pink-50 hover:text-text-brand"
          >
            <Bell className="size-5" />
          </button>
          <Link
            href="/settings/profile"
            className="ml-1 flex size-9 items-center justify-center overflow-hidden rounded-full bg-pink-100 text-sm font-semibold text-text-brand"
            aria-label="Your profile"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
