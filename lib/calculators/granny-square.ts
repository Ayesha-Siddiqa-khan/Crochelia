export type RoundingMode = "down" | "up" | "partial";

export interface GrannySquareInput {
  widthCm: number;
  lengthCm: number;
  squareSizeCm: number;
  roundingMode?: RoundingMode;
}

export interface GrannySquareResult {
  across: number;
  down: number;
  totalSquares: number;
  acrossExact: number;
  downExact: number;
  partialAcross: boolean;
  partialDown: boolean;
  coverageWidthCm: number;
  coverageLengthCm: number;
  coveragePercent: number;
  roundingMode: RoundingMode;
}

/**
 * Deterministic granny-square grid calculation. Pure function — see
 * PROJECT.md §9.2 and §13.1. Every value here is CALCULATED, not estimated.
 */
export function calculateGrannySquareGrid(
  input: GrannySquareInput,
): GrannySquareResult {
  const { widthCm, lengthCm, squareSizeCm } = input;
  const roundingMode = input.roundingMode ?? "down";

  if (widthCm <= 0 || lengthCm <= 0 || squareSizeCm <= 0) {
    throw new Error("Width, length and square size must all be greater than zero.");
  }

  const acrossExact = widthCm / squareSizeCm;
  const downExact = lengthCm / squareSizeCm;

  const applyRounding = (exact: number): number => {
    switch (roundingMode) {
      case "up":
      case "partial":
        return Math.ceil(exact);
      case "down":
      default:
        return Math.floor(exact);
    }
  };

  const across = Math.max(applyRounding(acrossExact), roundingMode === "down" ? 0 : 1);
  const down = Math.max(applyRounding(downExact), roundingMode === "down" ? 0 : 1);

  const coverageWidthCm = across * squareSizeCm;
  const coverageLengthCm = down * squareSizeCm;
  const targetArea = widthCm * lengthCm;
  const coverageArea = coverageWidthCm * coverageLengthCm;

  return {
    across,
    down,
    totalSquares: across * down,
    acrossExact,
    downExact,
    partialAcross: !Number.isInteger(acrossExact),
    partialDown: !Number.isInteger(downExact),
    coverageWidthCm,
    coverageLengthCm,
    coveragePercent: targetArea === 0 ? 0 : (coverageArea / targetArea) * 100,
    roundingMode,
  };
}
