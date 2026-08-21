import { getCurrentUser } from "@/lib/auth/current-user";
import { getPattern } from "@/lib/db/patterns";
import { PatternPricingCalculator } from "@/components/domain/pattern-pricing-calculator";
import type { YarnWeightClass } from "@/lib/calculators";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ pattern?: string }>;
}) {
  const { pattern: patternId } = await searchParams;
  const user = await getCurrentUser();

  let initial: { totalSquares?: number; squareSizeCm?: number; yarnWeight?: YarnWeightClass; label?: string } = {};

  if (patternId) {
    try {
      const pattern = await getPattern(patternId);
      if (pattern.total_squares && pattern.square_size_cm && pattern.yarn_weight) {
        initial = {
          totalSquares: pattern.total_squares,
          squareSizeCm: Number(pattern.square_size_cm),
          yarnWeight: pattern.yarn_weight as YarnWeightClass,
          label: `Prefilled from "${pattern.name}" — adjust anything below.`,
        };
      }
    } catch {
      // Pattern not found or not visible — just fall back to the blank calculator.
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl text-text-primary">Pricing calculator</h1>
      <p className="mt-1 text-text-secondary">
        Work out a costed, honest price for anything you make — every number is calculated
        from what you enter, never a guess.
      </p>
      <div className="mt-6">
        <PatternPricingCalculator
          initialTotalSquares={initial.totalSquares}
          initialSquareSizeCm={initial.squareSizeCm}
          initialYarnWeight={initial.yarnWeight}
          currency={user?.profile.currency ?? "USD"}
          contextLabel={initial.label}
        />
      </div>
    </div>
  );
}
