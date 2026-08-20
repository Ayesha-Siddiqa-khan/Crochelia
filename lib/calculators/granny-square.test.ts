import { describe, expect, it } from "vitest";
import { calculateGrannySquareGrid } from "./granny-square";

describe("calculateGrannySquareGrid", () => {
  it("computes the PROJECT.md worked example exactly", () => {
    const result = calculateGrannySquareGrid({
      widthCm: 50,
      lengthCm: 60,
      squareSizeCm: 10,
    });
    expect(result.across).toBe(5);
    expect(result.down).toBe(6);
    expect(result.totalSquares).toBe(30);
    expect(result.coveragePercent).toBe(100);
  });

  it("exact fit has no partial squares", () => {
    const result = calculateGrannySquareGrid({
      widthCm: 40,
      lengthCm: 40,
      squareSizeCm: 10,
    });
    expect(result.partialAcross).toBe(false);
    expect(result.partialDown).toBe(false);
    expect(result.totalSquares).toBe(16);
  });

  it("rounds down by default on non-divisible dimensions", () => {
    const result = calculateGrannySquareGrid({
      widthCm: 55,
      lengthCm: 42,
      squareSizeCm: 10,
    });
    expect(result.across).toBe(5);
    expect(result.down).toBe(4);
    expect(result.partialAcross).toBe(true);
    expect(result.partialDown).toBe(true);
    expect(result.coveragePercent).toBeLessThan(100);
  });

  it("rounds up when roundingMode is 'up'", () => {
    const result = calculateGrannySquareGrid({
      widthCm: 55,
      lengthCm: 42,
      squareSizeCm: 10,
      roundingMode: "up",
    });
    expect(result.across).toBe(6);
    expect(result.down).toBe(5);
    expect(result.coveragePercent).toBeGreaterThan(100);
  });

  it("'partial' mode also rounds up the grid but flags partial edges", () => {
    const result = calculateGrannySquareGrid({
      widthCm: 55,
      lengthCm: 42,
      squareSizeCm: 10,
      roundingMode: "partial",
    });
    expect(result.across).toBe(6);
    expect(result.partialAcross).toBe(true);
  });

  it("handles very large counts", () => {
    const result = calculateGrannySquareGrid({
      widthCm: 5000,
      lengthCm: 5000,
      squareSizeCm: 10,
    });
    expect(result.totalSquares).toBe(250_000);
  });

  it("handles a single square", () => {
    const result = calculateGrannySquareGrid({
      widthCm: 10,
      lengthCm: 10,
      squareSizeCm: 10,
    });
    expect(result.totalSquares).toBe(1);
  });

  it.each([
    { widthCm: 0, lengthCm: 10, squareSizeCm: 10 },
    { widthCm: 10, lengthCm: 0, squareSizeCm: 10 },
    { widthCm: 10, lengthCm: 10, squareSizeCm: 0 },
    { widthCm: -10, lengthCm: 10, squareSizeCm: 10 },
  ])("rejects zero or negative dimensions %o", (input) => {
    expect(() => calculateGrannySquareGrid(input)).toThrow();
  });
});
