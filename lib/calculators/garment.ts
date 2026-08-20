import { calculateGrannySquareGrid, type RoundingMode } from "./granny-square";

export type GarmentSize = "xs" | "s" | "m" | "l" | "xl" | "2xl";
export type GarmentType = "cardigan" | "sweater" | "top" | "skirt" | "blanket" | "scarf" | "bag";

interface SizeMeasurementsCm {
  bust: number;
  bodyLength: number;
  sleeveLength: number;
  sleeveWidth: number;
  waist: number;
  skirtLength: number;
}

/**
 * Standard approximate finished-garment measurements (adult sizing), used as
 * the deterministic basis for panel dimensions. This is a reference chart,
 * not a fit guarantee — PROJECT.md §9.2. Custom dimensions always override it.
 */
export const GARMENT_SIZE_CHART: Record<GarmentSize, SizeMeasurementsCm> = {
  xs: { bust: 86, bodyLength: 55, sleeveLength: 43, sleeveWidth: 28, waist: 68, skirtLength: 45 },
  s: { bust: 92, bodyLength: 57, sleeveLength: 44, sleeveWidth: 30, waist: 74, skirtLength: 47 },
  m: { bust: 100, bodyLength: 60, sleeveLength: 45, sleeveWidth: 33, waist: 82, skirtLength: 49 },
  l: { bust: 110, bodyLength: 63, sleeveLength: 46, sleeveWidth: 36, waist: 92, skirtLength: 51 },
  xl: { bust: 120, bodyLength: 65, sleeveLength: 47, sleeveWidth: 39, waist: 102, skirtLength: 53 },
  "2xl": { bust: 130, bodyLength: 68, sleeveLength: 48, sleeveWidth: 42, waist: 112, skirtLength: 55 },
};

const DEFAULT_EASE_CM = 5;

export interface GarmentPieceInput {
  name: string;
  widthCm: number;
  lengthCm: number;
  count: number;
}

export interface GarmentPieceResult extends GarmentPieceInput {
  across: number;
  down: number;
  squaresPerPiece: number;
  totalSquares: number;
}

export interface GarmentCalculationInput {
  type: GarmentType;
  size?: GarmentSize;
  squareSizeCm: number;
  roundingMode?: RoundingMode;
  easeCm?: number;
  /** Explicit piece overrides — required for "custom" projects, optional otherwise. */
  customPieces?: GarmentPieceInput[];
}

export interface GarmentCalculationResult {
  type: GarmentType;
  size?: GarmentSize;
  squareSizeCm: number;
  pieces: GarmentPieceResult[];
  totalSquares: number;
}

const SIZED_TYPES: readonly GarmentType[] = ["cardigan", "sweater", "top", "skirt"];

export function requiresSize(type: GarmentType): boolean {
  return SIZED_TYPES.includes(type);
}

function piecesForType(
  type: GarmentType,
  size: GarmentSize | undefined,
  easeCm: number,
): GarmentPieceInput[] {
  switch (type) {
    case "blanket":
      return [{ name: "Panel", widthCm: 120, lengthCm: 150, count: 1 }];
    case "scarf":
      return [{ name: "Panel", widthCm: 20, lengthCm: 150, count: 1 }];
    case "bag":
      return [
        { name: "Front", widthCm: 30, lengthCm: 30, count: 1 },
        { name: "Back", widthCm: 30, lengthCm: 30, count: 1 },
        { name: "Base", widthCm: 30, lengthCm: 10, count: 1 },
      ];
    case "cardigan":
    case "sweater":
    case "top":
    case "skirt": {
      if (!size) {
        throw new Error(`A size is required for garment type "${type}".`);
      }
      const m = GARMENT_SIZE_CHART[size];
      const panelWidth = m.bust / 2 + easeCm;

      if (type === "cardigan") {
        return [
          { name: "Left front", widthCm: panelWidth / 2, lengthCm: m.bodyLength, count: 1 },
          { name: "Right front", widthCm: panelWidth / 2, lengthCm: m.bodyLength, count: 1 },
          { name: "Back", widthCm: panelWidth, lengthCm: m.bodyLength, count: 1 },
          { name: "Sleeve", widthCm: m.sleeveWidth, lengthCm: m.sleeveLength, count: 2 },
        ];
      }
      if (type === "sweater") {
        return [
          { name: "Front", widthCm: panelWidth, lengthCm: m.bodyLength, count: 1 },
          { name: "Back", widthCm: panelWidth, lengthCm: m.bodyLength, count: 1 },
          { name: "Sleeve", widthCm: m.sleeveWidth, lengthCm: m.sleeveLength, count: 2 },
        ];
      }
      if (type === "top") {
        return [
          { name: "Front", widthCm: panelWidth, lengthCm: m.bodyLength * 0.6, count: 1 },
          { name: "Back", widthCm: panelWidth, lengthCm: m.bodyLength * 0.6, count: 1 },
        ];
      }
      return [
        { name: "Front", widthCm: m.waist / 2 + easeCm, lengthCm: m.skirtLength, count: 1 },
        { name: "Back", widthCm: m.waist / 2 + easeCm, lengthCm: m.skirtLength, count: 1 },
      ];
    }
  }
}

/**
 * Deterministic per-piece square breakdown for a garment or accessory.
 * Every piece's square count is CALCULATED via the granny-square grid,
 * never estimated. PROJECT.md §9.2 — garment calculators break results
 * down per piece and total them.
 */
export function calculateGarmentSquares(
  input: GarmentCalculationInput,
): GarmentCalculationResult {
  const { type, squareSizeCm } = input;
  const roundingMode = input.roundingMode ?? "down";
  const easeCm = input.easeCm ?? DEFAULT_EASE_CM;

  const sourcePieces: GarmentPieceInput[] =
    input.customPieces && input.customPieces.length > 0
      ? input.customPieces
      : piecesForType(type, input.size, easeCm);

  const pieces: GarmentPieceResult[] = sourcePieces.map((piece) => {
    const grid = calculateGrannySquareGrid({
      widthCm: piece.widthCm,
      lengthCm: piece.lengthCm,
      squareSizeCm,
      roundingMode,
    });
    return {
      ...piece,
      across: grid.across,
      down: grid.down,
      squaresPerPiece: grid.totalSquares,
      totalSquares: grid.totalSquares * piece.count,
    };
  });

  return {
    type,
    size: input.size,
    squareSizeCm,
    pieces,
    totalSquares: pieces.reduce((sum, p) => sum + p.totalSquares, 0),
  };
}
