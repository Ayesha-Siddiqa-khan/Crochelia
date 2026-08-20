export type YarnWeightClass =
  | "lace"
  | "fingering"
  | "sport"
  | "dk"
  | "worsted"
  | "bulky"
  | "super-bulky";

export type EstimateConfidence = "low" | "medium" | "high";

interface WeightClassCoefficients {
  /** Approximate metres yielded by 100g of yarn at this weight. */
  metersPer100g: number;
  /** Approximate grams consumed by one 10cm × 10cm double-crochet swatch. */
  gramsPerSquareAt10cm: number;
}

/**
 * Reference consumption coefficients, versioned. These are commonly-cited
 * approximate figures for double-crochet fabric density — not a substitute
 * for a user's own gauge swatch. PROJECT.md §9.3: yarn estimates are always
 * labelled Estimate, never exact.
 */
export const YARN_WEIGHT_COEFFICIENTS: Record<YarnWeightClass, WeightClassCoefficients> = {
  lace: { metersPer100g: 800, gramsPerSquareAt10cm: 4 },
  fingering: { metersPer100g: 400, gramsPerSquareAt10cm: 6 },
  sport: { metersPer100g: 300, gramsPerSquareAt10cm: 7 },
  dk: { metersPer100g: 225, gramsPerSquareAt10cm: 8 },
  worsted: { metersPer100g: 200, gramsPerSquareAt10cm: 10 },
  bulky: { metersPer100g: 125, gramsPerSquareAt10cm: 14 },
  "super-bulky": { metersPer100g: 80, gramsPerSquareAt10cm: 20 },
};

export interface YarnEstimateInput {
  totalSquares: number;
  squareSizeCm: number;
  weightClass: YarnWeightClass;
  bufferPercent?: number;
  skeinWeightGrams?: number;
  /** Presence of a real user gauge swatch raises confidence to "high". */
  hasGaugeSwatch?: boolean;
}

export interface YarnEstimateResult {
  estimatedMeters: number;
  estimatedGrams: number;
  recommendedGramsWithBuffer: number;
  recommendedSkeins: number;
  bufferPercent: number;
  confidence: EstimateConfidence;
  weightClass: YarnWeightClass;
}

/**
 * Deterministic yarn-quantity ESTIMATE. Output must always be presented to
 * the user as an estimate with its confidence and basis shown — never as a
 * calculated/guaranteed value. PROJECT.md §4.4, §9.3.
 */
export function estimateYarnRequirement(input: YarnEstimateInput): YarnEstimateResult {
  const {
    totalSquares,
    squareSizeCm,
    weightClass,
    bufferPercent = 15,
    skeinWeightGrams = 100,
    hasGaugeSwatch = false,
  } = input;

  if (totalSquares <= 0 || squareSizeCm <= 0 || skeinWeightGrams <= 0) {
    throw new Error("totalSquares, squareSizeCm and skeinWeightGrams must all be greater than zero.");
  }

  const coefficients = YARN_WEIGHT_COEFFICIENTS[weightClass];
  const areaScale = (squareSizeCm / 10) ** 2;
  const gramsPerSquare = coefficients.gramsPerSquareAt10cm * areaScale;
  const estimatedGrams = gramsPerSquare * totalSquares;
  const estimatedMeters = estimatedGrams * (coefficients.metersPer100g / 100);
  const recommendedGramsWithBuffer = estimatedGrams * (1 + bufferPercent / 100);
  const recommendedSkeins = Math.ceil(recommendedGramsWithBuffer / skeinWeightGrams);

  const confidence: EstimateConfidence = hasGaugeSwatch
    ? "high"
    : totalSquares > 0 && squareSizeCm > 0
      ? "medium"
      : "low";

  return {
    estimatedMeters,
    estimatedGrams,
    recommendedGramsWithBuffer,
    recommendedSkeins,
    bufferPercent,
    confidence,
    weightClass,
  };
}
