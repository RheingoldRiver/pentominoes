import { DEFAULT_COLORS, EMPTY_GRID, PlacedPentomino, SURFACES } from "./../../constants";
import { expect, test } from "vitest";
import { deserializeUrl } from "./urlConfig";
import { decodeSurfacelessUrl } from "./urlConfigLegacy";
import { PENTOMINOES } from "../../pentominoes";

test("[legacy urls] a URL is properly decoded when no pentominoes are placed", () => {
  expect(decodeSurfacelessUrl("8_8")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [],
    colors: {},
    surface: SURFACES.Rectangle,
  });
});

test("[legacy urls] a URL is properly decoded with colors but no pentominoes", () => {
  expect(decodeSurfacelessUrl("8_8_1F")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [],
    colors: { 1: ["F"] },
    surface: SURFACES.Rectangle,
  });
});

test("[legacy urls] a URL is properly decoded with colors and pentominoes", () => {
  expect(decodeSurfacelessUrl("8_8I04_4_1F")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "I",
        r: "0",
        c: "4_4",
      },
    ],
    colors: { 1: ["F"] },
    surface: SURFACES.Rectangle,
  });
  expect(decodeSurfacelessUrl("8_8i044_1F")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "i", // will be uppercased when it's put into the grid
        r: "0",
        c: "44",
      },
    ],
    colors: { 1: ["F"] },
    surface: SURFACES.Rectangle,
  });
});

test("[legacy urls] a URL is properly decoded, no asymmetry", () => {
  expect(decodeSurfacelessUrl("8_8I04_4")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "I",
        r: "0",
        c: "4_4",
      },
    ],
    colors: {},
    surface: SURFACES.Rectangle,
  });
  expect(decodeSurfacelessUrl("8_8i044")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "i", // will be uppercased when it's put into the grid
        r: "0",
        c: "44",
      },
    ],
    colors: {},
    surface: SURFACES.Rectangle,
  });
});

test("[legacy urls] a URL is properly decoded, asymmetry", () => {
  expect(decodeSurfacelessUrl("6_10I04_6")).toStrictEqual({
    h: 6,
    w: 10,
    pentominoes: [
      {
        p: "I",
        r: "0",
        c: "4_6",
      },
    ],
    colors: {},
    surface: SURFACES.Rectangle,
  });
  expect(decodeSurfacelessUrl("6_10i046")).toStrictEqual({
    h: 6,
    w: 10,
    pentominoes: [
      {
        p: "i", // will be uppercased when it's put into the grid
        r: "0",
        c: "46",
      },
    ],
    colors: {},
    surface: SURFACES.Rectangle,
  });
});

test("[legacy urls] you get the right grid, no asymmetry", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(8, 8);
  grid[4][4].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("8_8I04_4", false)).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: SURFACES.Rectangle,
  });
  expect(deserializeUrl("8_8i044", false)).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: SURFACES.Rectangle,
  });
});

test("[legacy urls] you get the right grid, asymmetry", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(10, 6);
  grid[4][6].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("6_10I04_6", false)).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: SURFACES.Rectangle,
  });
  expect(deserializeUrl("6_10i046", false)).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: SURFACES.Rectangle,
  });
});
