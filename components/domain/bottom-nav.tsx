"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS: ReadonlyArray<{
  href: string;
  label: string;
  icon: typeof Home;
  isFab?: boolean;
}> = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/projects/new", label: "Create", icon: Plus, isFab: true },
  { href: "/community", label: "Community", icon: Users },
  { href: "/yarn", label: "Stash", icon: Package },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-raised/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md items-center justify-between px-2">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href.split("/new")[0]) && !item.isFab;
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="Create"
                className="-translate-y-3 flex size-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-[var(--shadow-brand)] transition-transform active:scale-95"
              >
                <Icon className="size-6" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 pt-2 text-[11px] font-medium",
                active ? "text-text-brand" : "text-text-tertiary",
              )}
            >
              <span
                className={cn(
                  "relative flex items-center justify-center",
                  active && "after:absolute after:-top-2 after:h-0.5 after:w-5 after:rounded-full after:bg-pink-500",
                )}
              >
                <Icon className="size-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
