const IN_PER_CM = 1 / 2.54;
const G_PER_OZ = 28.349523125;
const M_PER_YD = 0.9144;

export function cmToIn(cm: number): number {
  return cm * IN_PER_CM;
}

export function inToCm(inches: number): number {
  return inches * 2.54;
}

export function mmToCm(mm: number): number {
  return mm / 10;
}

export function cmToMm(cm: number): number {
  return cm * 10;
}

export function gToOz(g: number): number {
  return g / G_PER_OZ;
}

export function ozToG(oz: number): number {
  return oz * G_PER_OZ;
}

export function mToYd(m: number): number {
  return m / M_PER_YD;
}

export function ydToM(yd: number): number {
  return yd * M_PER_YD;
}

export function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
