import { expect, test } from "vitest";
import { DEFAULT_COLORS, EMPTY_GRID } from "../../constants";
import { encodeColor, encodeOrientation, encodePentomino, HALF_NUM_COLORS, serializeUnusedColors } from "./urlConfig";

test("pentomino names are encoded properly", () => {
  expect(encodePentomino("W", 0)).toBe("W");
  expect(encodePentomino("W", 5)).toBe("W");
  expect(encodePentomino("W", 6)).toBe("w");
  expect(encodePentomino("W", 11)).toBe("w");
});

test("we have the right half num colors", () => {
  expect(HALF_NUM_COLORS).toBe(6);
});

test("pentomino colors are encoded properly", () => {
  expect(encodeOrientation(0, 0, 6)).toBe("0");
});

test("a color is encoded properly", () => {
  expect(encodeColor(1)).toBe(1);
  expect(encodeColor(6)).toBe(0);
});

test("we're serializing unused colors correctly", () => {
  const grid = EMPTY_GRID(8, 8);
  const colors = { ...DEFAULT_COLORS };
  colors["P"] = 6;
  colors["W"] = 1;
  expect(serializeUnusedColors(colors, grid)).toBe("_0p1W");
});
