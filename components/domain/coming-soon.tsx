import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";

export interface ComingSoonProps {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  primaryHref: string;
  primaryLabel: string;
}

export function ComingSoon({
  icon,
  eyebrow,
  title,
  description,
  bullets,
  primaryHref,
  primaryLabel,
}: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="text-4xl">{icon}</div>
      <Badge tone="brand" className="mt-4">
        {eyebrow} · Coming soon
      </Badge>
      <h1 className="mt-4 font-display text-3xl text-text-primary sm:text-4xl">{title}</h1>
      <p className="mt-3 text-text-secondary">{description}</p>

      <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2 text-left text-sm text-text-secondary">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pink-400" aria-hidden />
            {b}
          </li>
        ))}
      </ul>

      <Button size="lg" className="mt-8" asChild>
        <Link href={primaryHref}>{primaryLabel}</Link>
      </Button>
    </div>
  );
}
