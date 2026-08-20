import { describe, expect, it } from "vitest";
import { estimateYarnRequirement, YARN_WEIGHT_COEFFICIENTS, type YarnWeightClass } from "./yarn";

const weightClasses = Object.keys(YARN_WEIGHT_COEFFICIENTS) as YarnWeightClass[];

describe("estimateYarnRequirement", () => {
  it.each(weightClasses)("produces a positive estimate for every weight class: %s", (weightClass) => {
    const result = estimateYarnRequirement({
      totalSquares: 30,
      squareSizeCm: 10,
      weightClass,
    });
    expect(result.estimatedGrams).toBeGreaterThan(0);
    expect(result.estimatedMeters).toBeGreaterThan(0);
    expect(result.recommendedSkeins).toBeGreaterThan(0);
  });

  it("applies the default 15% buffer", () => {
    const result = estimateYarnRequirement({
      totalSquares: 30,
      squareSizeCm: 10,
      weightClass: "worsted",
    });
    expect(result.recommendedGramsWithBuffer).toBeCloseTo(result.estimatedGrams * 1.15, 6);
  });

  it("buffer percent is adjustable", () => {
    const result = estimateYarnRequirement({
      totalSquares: 30,
      squareSizeCm: 10,
      weightClass: "worsted",
      bufferPercent: 25,
    });
    expect(result.recommendedGramsWithBuffer).toBeCloseTo(result.estimatedGrams * 1.25, 6);
  });

  it("scales with square area, not just count", () => {
    const small = estimateYarnRequirement({
      totalSquares: 30,
      squareSizeCm: 10,
      weightClass: "worsted",
    });
    const large = estimateYarnRequirement({
      totalSquares: 30,
      squareSizeCm: 20,
      weightClass: "worsted",
    });
    expect(large.estimatedGrams).toBeCloseTo(small.estimatedGrams * 4, 6);
  });

  it("confidence is high only with a gauge swatch", () => {
    const withSwatch = estimateYarnRequirement({
      totalSquares: 30,
      squareSizeCm: 10,
      weightClass: "worsted",
      hasGaugeSwatch: true,
    });
    const without = estimateYarnRequirement({
      totalSquares: 30,
      squareSizeCm: 10,
      weightClass: "worsted",
    });
    expect(withSwatch.confidence).toBe("high");
    expect(without.confidence).toBe("medium");
  });

  it("skein count rounds up, never leaving the user short", () => {
    const result = estimateYarnRequirement({
      totalSquares: 1,
      squareSizeCm: 10,
      weightClass: "worsted",
      skeinWeightGrams: 100,
    });
    expect(result.recommendedSkeins).toBe(
      Math.ceil(result.recommendedGramsWithBuffer / 100),
    );
  });

  it.each([
    { totalSquares: 0, squareSizeCm: 10, weightClass: "worsted" as YarnWeightClass },
    { totalSquares: 10, squareSizeCm: 0, weightClass: "worsted" as YarnWeightClass },
  ])("rejects invalid inputs %o", (input) => {
    expect(() => estimateYarnRequirement(input)).toThrow();
  });
});
