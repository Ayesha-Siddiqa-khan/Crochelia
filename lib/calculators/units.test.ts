import { describe, expect, it } from "vitest";
import { cmToIn, gToOz, inToCm, mToYd, mmToCm, ozToG, round, ydToM } from "./units";

describe("unit conversions round-trip within tolerance", () => {
  it.each([0, 1, 10, 50.5, 123.456])("cm <-> in for %f", (cm) => {
    expect(inToCm(cmToIn(cm))).toBeCloseTo(cm, 9);
  });

  it.each([0, 1, 28.35, 500])("g <-> oz for %f", (g) => {
    expect(ozToG(gToOz(g))).toBeCloseTo(g, 9);
  });

  it.each([0, 1, 91.44, 1000])("m <-> yd for %f", (m) => {
    expect(ydToM(mToYd(m))).toBeCloseTo(m, 9);
  });

  it("mm to cm", () => {
    expect(mmToCm(100)).toBe(10);
  });

  it("1 inch is exactly 2.54cm", () => {
    expect(inToCm(1)).toBe(2.54);
  });

  it("1 yard is exactly 0.9144m", () => {
    expect(ydToM(1)).toBe(0.9144);
  });
});

describe("round", () => {
  it("rounds to whole numbers by default", () => {
    expect(round(1.4)).toBe(1);
    expect(round(1.5)).toBe(2);
  });

  it("rounds to given decimal places", () => {
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.876, 2)).toBe(1.88);
  });
});
