import { describe, expect, it } from "vitest";
import { getBlinkInterval } from "./blink.ts";

describe("getBlinkInterval", () => {
  it("returns the configured minimum and maximum for the random bounds", () => {
    expect(getBlinkInterval(0)).toBe(5_000);
    expect(getBlinkInterval(1)).toBe(9_000);
  });

  it("returns an interval inside the configured range", () => {
    expect(getBlinkInterval(0.5)).toBe(7_000);
  });
});
