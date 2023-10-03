import { DEFAULT_COLORS, EMPTY_GRID, PlacedPentomino, Surface } from "./../../constants";
import { expect, test } from "vitest";
import { decodeSurfacelessUrl, deserializeUrl } from "./urlConfig";
import { PENTOMINOES } from "../../pentominoes";

test("[legacy urls] a URL is properly decoded when no pentominoes are placed", () => {
  expect(decodeSurfacelessUrl("8_8")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [],
    colors: {},
    surface: Surface.Rectangle,
  });
});

test("[legacy urls] a URL is properly decoded with colors but no pentominoes", () => {
  expect(decodeSurfacelessUrl("8_8_1F")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [],
    colors: { 1: ["F"] },
    surface: Surface.Rectangle,
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
    surface: Surface.Rectangle,
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
    surface: Surface.Rectangle,
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
    surface: Surface.Rectangle,
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
    surface: Surface.Rectangle,
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
    surface: Surface.Rectangle,
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
    surface: Surface.Rectangle,
  });
});

test("[legacy urls] you get the right grid, no asymmetry", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(8, 8);
  grid[4][4].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("8_8I04_4")).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: Surface.Rectangle,
  });
  expect(deserializeUrl("8_8i044")).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: Surface.Rectangle,
  });
});

test("[legacy urls] you get the right grid, asymmetry", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(10, 6);
  grid[4][6].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("6_10I04_6")).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: Surface.Rectangle,
  });
  expect(deserializeUrl("6_10i046")).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: Surface.Rectangle,
  });
});
