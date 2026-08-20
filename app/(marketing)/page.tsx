import Link from "next/link";
import { Hero } from "@/components/domain/hero";
import { ScrollReveal } from "@/components/domain/scroll-reveal";
import { PatternCard, type PatternCardData } from "@/components/domain/pattern-card";
import { StashCoverageBar } from "@/components/domain/stash-coverage-bar";
import { ProgressBar } from "@/components/domain/progress-bar";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Card } from "@/components/surfaces/card";
import { calculatePricing } from "@/lib/calculators";
import { ArrowRight } from "lucide-react";

const SAMPLE_PATTERNS: PatternCardData[] = [
  { id: "1", name: "Blush Granny Cardigan", creatorName: "Ayesha", difficulty: "intermediate" },
  { id: "2", name: "Cloud Stitch Scarf", creatorName: "Noor", difficulty: "beginner" },
  { id: "3", name: "Sage Market Bag", creatorName: "Hana", difficulty: "beginner" },
  { id: "4", name: "Blossom Amigurumi", creatorName: "Zara", difficulty: "advanced", aiGenerated: true },
];

const pricingPreview = calculatePricing({
  materialCostMinor: 120_000,
  laborHours: 12,
  laborRateMinorPerHour: 12_500,
  packagingMinor: 20_000,
  deliveryMinor: 15_000,
  platformFeePercent: 5,
  currency: "PKR",
});

function formatMinor(minor: number) {
  return `Rs. ${(minor / 100).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export default function LandingPage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl space-y-28 px-4 py-20 sm:px-6">
        <JourneyRow
          eyebrow="Discover"
          title="Find your next make"
          description="Patterns matched to your skill level and the yarn already sitting in your stash."
        >
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {SAMPLE_PATTERNS.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        </JourneyRow>

        <JourneyRow
          eyebrow="Plan"
          title="Describe it, then refine it"
          description={'"A medium granny-square cardigan in blush and cream" becomes a structured project draft — every field editable, nothing hidden.'}
          reverse
        >
          <Card className="max-w-md p-5">
            <p className="text-sm text-text-secondary">Draft from your description</p>
            <div className="mt-3 space-y-2 text-sm">
              <Row label="Type" value="Cardigan" ai />
              <Row label="Construction" value="Granny-square" ai />
              <Row label="Size" value="Medium" ai />
              <Row label="Palette" value="Blush + Cream" ai />
            </div>
          </Card>
        </JourneyRow>

        <JourneyRow
          eyebrow="Calculate"
          title="See the maths, not just the answer"
          description="Every piece is broken down and totalled. Estimates are always labelled as estimates."
        >
          <Card className="max-w-md p-5">
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Front + Back + Sleeves</span>
              <Badge tone="brand">Calculated</Badge>
            </div>
            <p className="mt-2 font-display text-3xl text-text-brand">40 squares</p>
            <div className="mt-4 border-t border-border-subtle pt-4">
              <StashCoverageBar
                colorName="Blush"
                colorSwatch="var(--pink-300)"
                ownedGrams={216}
                neededGrams={300}
              />
            </div>
          </Card>
        </JourneyRow>

        <JourneyRow
          eyebrow="Make & Track"
          title="Know exactly where you left off"
          description="Tick off squares as you finish them. Your progress, photos and notes stay together."
          reverse
        >
          <Card className="max-w-md p-5">
            <p className="font-display text-lg text-text-primary">Pink Granny Cardigan</p>
            <div className="mt-3">
              <ProgressBar value={32} max={40} label="Cardigan progress" />
            </div>
            <p className="mt-2 text-sm text-text-secondary">32 / 40 squares · 80%</p>
          </Card>
        </JourneyRow>

        <JourneyRow
          eyebrow="Share"
          title="A portfolio, not a feed of noise"
          description="Post finished work, tag the pattern and yarn you used, and build a following of people who make what you make."
        >
          <div className="grid grid-cols-3 gap-2">
            {["var(--pink-100)", "var(--accent-cream)", "var(--pink-200)", "var(--accent-sage)", "var(--pink-300)", "var(--accent-sand)"].map(
              (color, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[var(--radius-md)]"
                  style={{ background: color }}
                />
              ),
            )}
          </div>
        </JourneyRow>

        <JourneyRow
          eyebrow="Sell"
          title="Turn a finished piece into income"
          description="A costed, honest price suggestion — always shown as a range, never a false promise."
          reverse
        >
          <Card className="max-w-md p-5 font-mono text-sm">
            <Line label="Material cost" value={formatMinor(pricingPreview.materialCostMinor)} />
            <Line label="Labour" value={formatMinor(pricingPreview.laborCostMinor)} />
            <Line label="Packaging" value={formatMinor(pricingPreview.packagingMinor)} />
            <Line label="Delivery" value={formatMinor(pricingPreview.deliveryMinor)} />
            <div className="my-2 border-t border-border-subtle" />
            <Line label="Estimated cost" value={formatMinor(pricingPreview.estimatedCostMinor)} strong />
            <div className="mt-3 rounded-[var(--radius-md)] bg-surface-blush p-3 text-center font-sans">
              <p className="text-xs text-text-tertiary">Suggested price (estimate)</p>
              <p className="font-display text-xl text-text-brand">
                {formatMinor(pricingPreview.suggestedPriceLowMinor)} –{" "}
                {formatMinor(pricingPreview.suggestedPriceHighMinor)}
              </p>
            </div>
          </Card>
        </JourneyRow>
      </section>

      <section className="border-t border-border-subtle bg-surface-blush">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <ScrollReveal>
            <h2 className="font-display text-4xl text-text-primary sm:text-5xl">
              Your crochet story starts here
            </h2>
            <p className="mx-auto mt-4 max-w-md text-text-secondary">
              Free to start. Bring your first project idea and see the whole journey in
              minutes.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/sign-up">
                Start creating <ArrowRight className="size-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

function JourneyRow({
  eyebrow,
  title,
  description,
  children,
  reverse,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <ScrollReveal>
        <Badge tone="brand">{eyebrow}</Badge>
        <h2 className="mt-3 font-display text-3xl text-text-primary sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-md text-text-secondary">{description}</p>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>{children}</ScrollReveal>
    </div>
  );
}

function Row({ label, value, ai }: { label: string; value: string; ai?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-surface-sunken px-3 py-2">
      <span className="text-text-tertiary">{label}</span>
      <span className="flex items-center gap-1.5 font-medium text-text-primary">
        {value}
        {ai && <Badge tone="ai">AI</Badge>}
      </span>
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-0.5 ${strong ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
