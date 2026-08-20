import { describe, expect, it } from "vitest";
import { calculatePricing } from "./pricing";

describe("calculatePricing", () => {
  it("matches the PROJECT.md worked example", () => {
    const result = calculatePricing({
      materialCostMinor: 120_000,
      laborHours: 12,
      laborRateMinorPerHour: 12_500,
      packagingMinor: 20_000,
      deliveryMinor: 15_000,
      platformFeePercent: 5,
      currency: "PKR",
    });
    expect(result.laborCostMinor).toBe(150_000);
    expect(result.platformFeeMinor).toBe(15_250);
    expect(result.estimatedCostMinor).toBe(320_250);
  });

  it("zero-cost inputs produce a zero estimated cost", () => {
    const result = calculatePricing({
      materialCostMinor: 0,
      laborHours: 0,
      laborRateMinorPerHour: 0,
      packagingMinor: 0,
      deliveryMinor: 0,
      currency: "USD",
    });
    expect(result.estimatedCostMinor).toBe(0);
    expect(result.suggestedPriceLowMinor).toBe(0);
  });

  it("suggested price is always a range with high >= low", () => {
    const result = calculatePricing({
      materialCostMinor: 10_000,
      laborHours: 2,
      laborRateMinorPerHour: 5_000,
      packagingMinor: 500,
      deliveryMinor: 500,
      currency: "USD",
    });
    expect(result.suggestedPriceHighMinor).toBeGreaterThanOrEqual(result.suggestedPriceLowMinor);
  });

  it("margin percent reflects profit over price, not cost", () => {
    const result = calculatePricing({
      materialCostMinor: 10_000,
      laborHours: 0,
      laborRateMinorPerHour: 0,
      packagingMinor: 0,
      deliveryMinor: 0,
      marginRangeLowPercent: 25,
      marginRangeHighPercent: 25,
      currency: "USD",
    });
    // price = cost * 1.25, so margin = (price - cost) / price = 0.25 / 1.25 = 20%
    expect(result.marginLowPercent).toBeCloseTo(20, 6);
  });

  it("rejects negative cost inputs", () => {
    expect(() =>
      calculatePricing({
        materialCostMinor: -1,
        laborHours: 0,
        laborRateMinorPerHour: 0,
        packagingMinor: 0,
        deliveryMinor: 0,
        currency: "USD",
      }),
    ).toThrow();
  });

  it("all monetary outputs are integers (minor units)", () => {
    const result = calculatePricing({
      materialCostMinor: 1_234,
      laborHours: 3.7,
      laborRateMinorPerHour: 1_111,
      packagingMinor: 77,
      deliveryMinor: 33,
      platformFeePercent: 3.3,
      currency: "USD",
    });
    for (const key of [
      "laborCostMinor",
      "platformFeeMinor",
      "estimatedCostMinor",
      "suggestedPriceLowMinor",
      "suggestedPriceHighMinor",
    ] as const) {
      expect(Number.isInteger(result[key])).toBe(true);
    }
  });
});
