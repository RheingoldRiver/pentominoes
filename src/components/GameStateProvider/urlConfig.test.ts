import { DEFAULT_COLORS, EMPTY_GRID, MAX_NUM_COLORS, PlacedPentomino, SURFACES } from "./../../constants";
import { expect, test } from "vitest";
import {
  decodeCoordinates,
  decodeUrl,
  deserializeUrl,
  encodeNumber,
  NUM_LETTERS_IN_ALPHABET,
  NUM_SPATIAL_ORIENTATIONS,
  serializeUrl,
} from "./urlConfig";
import { PENTOMINOES } from "../../pentominoes";

test("max num colors is small enough", () => {
  const POSSIBLE_CASES = 2; // uppercase & lowercase
  const PENTOMINO_NAME_CASES = POSSIBLE_CASES;
  const ORIENTATION_CASES = POSSIBLE_CASES;
  const possibleRepresentations = NUM_LETTERS_IN_ALPHABET * ORIENTATION_CASES * PENTOMINO_NAME_CASES;
  expect(possibleRepresentations >= (MAX_NUM_COLORS - 1) * NUM_SPATIAL_ORIENTATIONS).toBe(true);
});

test("encoding numbers works", () => {
  expect(encodeNumber(0)).toBe("0");
  expect(encodeNumber(9)).toBe("9");
  expect(encodeNumber(10)).toBe("a");
  expect(encodeNumber(35)).toBe("z");
  expect(encodeNumber(36)).toBe("A");
  expect(encodeNumber(59)).toBe("X");
});

test("encoding works when there are no colors", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.X;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: SURFACES.Torus })).toBe("T88X033");
});

test("encoding colors when pentominoes are placed works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.X;
  const colors = { ...DEFAULT_COLORS };
  colors.X = 1;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: SURFACES.Torus })).toBe("T88X033");
});

test("lowercase is correctly added to the URL", () => {
  const grid = EMPTY_GRID(20, 20);
  grid[14][14].pentomino = PENTOMINOES.X;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: SURFACES.Torus })).toBe("TkkX0ee");
});

test("decoding an orientation works", () => {
  expect(decodeCoordinates("5_10", false)).toStrictEqual({
    x: 5,
    y: 10,
  });
});

test("a URL is properly decoded when no pentominoes are placed", () => {
  expect(decodeUrl("T88")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [],
    colors: {},
    surface: SURFACES.Torus,
  });
});

test("a URL is properly decoded with colors but no pentominoes", () => {
  expect(decodeUrl("T88_1F")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [],
    colors: { 1: ["F"] },
    surface: SURFACES.Torus,
  });
});

test("a URL is properly decoded with colors and pentominoes", () => {
  expect(decodeUrl("T88I044_1F")).toStrictEqual({
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
    surface: SURFACES.Torus,
  });
});

test("a URL is properly decoded, no asymmetry", () => {
  expect(decodeUrl("T88I044")).toStrictEqual({
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
    surface: SURFACES.Torus,
  });
});

test("a URL is properly decoded with a 2-digit dimension", () => {
  expect(decodeUrl("T6aI046")).toStrictEqual({
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
    surface: SURFACES.Torus,
  });
});

test("you get the right grid with single-digit numbers", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(8, 8);
  grid[4][4].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("K88I044", false)).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: SURFACES.KleinBottle,
  });
});

test("you get the right grid with two-digit  numbers", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(10, 6);
  grid[4][6].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("P6aI046", false)).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
    surface: SURFACES.ProjectivePlane,
  });
});
