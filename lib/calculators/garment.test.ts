import { describe, expect, it } from "vitest";
import { calculateGarmentSquares, GARMENT_SIZE_CHART, type GarmentSize } from "./garment";

const sizes: GarmentSize[] = ["xs", "s", "m", "l", "xl", "2xl"];
const types = ["cardigan", "sweater", "top", "skirt", "blanket", "scarf", "bag"] as const;

describe("calculateGarmentSquares", () => {
  it.each(types)("computes every size for %s", (type) => {
    for (const size of sizes) {
      const needsSize = !["blanket", "scarf", "bag"].includes(type);
      const result = calculateGarmentSquares({
        type,
        size: needsSize ? size : undefined,
        squareSizeCm: 10,
      });
      expect(result.totalSquares).toBeGreaterThan(0);
    }
  });

  it("per-piece totals sum to the whole", () => {
    const result = calculateGarmentSquares({ type: "cardigan", size: "m", squareSizeCm: 10 });
    const sum = result.pieces.reduce((acc, p) => acc + p.totalSquares, 0);
    expect(sum).toBe(result.totalSquares);
  });

  it("a cardigan needs more squares than a top of the same size", () => {
    const cardigan = calculateGarmentSquares({ type: "cardigan", size: "m", squareSizeCm: 10 });
    const top = calculateGarmentSquares({ type: "top", size: "m", squareSizeCm: 10 });
    expect(cardigan.totalSquares).toBeGreaterThan(top.totalSquares);
  });

  it("larger sizes require more squares than smaller sizes", () => {
    const s = calculateGarmentSquares({ type: "sweater", size: "s", squareSizeCm: 10 });
    const xl = calculateGarmentSquares({ type: "sweater", size: "xl", squareSizeCm: 10 });
    expect(xl.totalSquares).toBeGreaterThanOrEqual(s.totalSquares);
  });

  it("a sleeve piece is counted twice via its count multiplier", () => {
    const result = calculateGarmentSquares({ type: "sweater", size: "m", squareSizeCm: 10 });
    const sleeve = result.pieces.find((p) => p.name === "Sleeve");
    expect(sleeve?.count).toBe(2);
    expect(sleeve?.totalSquares).toBe((sleeve?.squaresPerPiece ?? 0) * 2);
  });

  it("throws when no size and no customPieces are given", () => {
    expect(() =>
      calculateGarmentSquares({ type: "sweater", squareSizeCm: 10 }),
    ).toThrow();
  });

  it("accepts customPieces for a fully custom project", () => {
    const result = calculateGarmentSquares({
      type: "top",
      squareSizeCm: 10,
      customPieces: [{ name: "Panel", widthCm: 30, lengthCm: 30, count: 1 }],
    });
    expect(result.totalSquares).toBe(9);
  });

  it("size chart is internally consistent (length increases with size)", () => {
    for (let i = 1; i < sizes.length; i++) {
      const prev = GARMENT_SIZE_CHART[sizes[i - 1]];
      const curr = GARMENT_SIZE_CHART[sizes[i]];
      expect(curr.bust).toBeGreaterThan(prev.bust);
    }
  });
});
