import Link from "next/link";
import { Logo } from "@/components/domain/logo";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/discover", label: "Discover" },
      { href: "/patterns", label: "Patterns" },
      { href: "/community", label: "Community" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface-sunken">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-text-secondary">
              The digital home for crocheters — discover, plan, calculate, make, track,
              share, and sell.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  {col.heading}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary hover:text-text-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs text-text-tertiary">
          © {new Date().getFullYear()} Crochelia. Made with love for makers.
        </p>
      </div>
    </footer>
  );
}
