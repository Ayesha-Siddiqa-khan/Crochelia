/**
 * All money figures are integer MINOR UNITS (e.g. paisa, cents) —
 * PROJECT.md §9.12, §11.1. Never floats.
 */
export interface PricingInput {
  materialCostMinor: number;
  laborHours: number;
  laborRateMinorPerHour: number;
  packagingMinor: number;
  deliveryMinor: number;
  otherCostsMinor?: number;
  platformFeePercent?: number;
  marginRangeLowPercent?: number;
  marginRangeHighPercent?: number;
  currency: string;
}

export interface PricingResult {
  materialCostMinor: number;
  laborCostMinor: number;
  packagingMinor: number;
  deliveryMinor: number;
  otherCostsMinor: number;
  platformFeeMinor: number;
  estimatedCostMinor: number;
  suggestedPriceLowMinor: number;
  suggestedPriceHighMinor: number;
  estimatedProfitLowMinor: number;
  estimatedProfitHighMinor: number;
  marginLowPercent: number;
  marginHighPercent: number;
  currency: string;
}

/**
 * Deterministic cost breakdown and price ESTIMATE. Suggested price is
 * always a range, never a single guaranteed figure — PROJECT.md §9.12.
 */
export function calculatePricing(input: PricingInput): PricingResult {
  const {
    materialCostMinor,
    laborHours,
    laborRateMinorPerHour,
    packagingMinor,
    deliveryMinor,
    otherCostsMinor = 0,
    platformFeePercent = 0,
    marginRangeLowPercent = 25,
    marginRangeHighPercent = 40,
    currency,
  } = input;

  if (
    materialCostMinor < 0 ||
    laborHours < 0 ||
    laborRateMinorPerHour < 0 ||
    packagingMinor < 0 ||
    deliveryMinor < 0 ||
    otherCostsMinor < 0
  ) {
    throw new Error("Cost inputs cannot be negative.");
  }

  const laborCostMinor = Math.round(laborHours * laborRateMinorPerHour);
  const subtotalMinor =
    materialCostMinor + laborCostMinor + packagingMinor + deliveryMinor + otherCostsMinor;
  const platformFeeMinor = Math.round(subtotalMinor * (platformFeePercent / 100));
  const estimatedCostMinor = subtotalMinor + platformFeeMinor;

  const suggestedPriceLowMinor = Math.round(
    estimatedCostMinor * (1 + marginRangeLowPercent / 100),
  );
  const suggestedPriceHighMinor = Math.round(
    estimatedCostMinor * (1 + marginRangeHighPercent / 100),
  );

  const estimatedProfitLowMinor = suggestedPriceLowMinor - estimatedCostMinor;
  const estimatedProfitHighMinor = suggestedPriceHighMinor - estimatedCostMinor;

  return {
    materialCostMinor,
    laborCostMinor,
    packagingMinor,
    deliveryMinor,
    otherCostsMinor,
    platformFeeMinor,
    estimatedCostMinor,
    suggestedPriceLowMinor,
    suggestedPriceHighMinor,
    estimatedProfitLowMinor,
    estimatedProfitHighMinor,
    marginLowPercent:
      suggestedPriceLowMinor === 0 ? 0 : (estimatedProfitLowMinor / suggestedPriceLowMinor) * 100,
    marginHighPercent:
      suggestedPriceHighMinor === 0
        ? 0
        : (estimatedProfitHighMinor / suggestedPriceHighMinor) * 100,
    currency,
  };
}
