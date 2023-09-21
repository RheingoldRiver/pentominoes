import { DEFAULT_COLORS, EMPTY_GRID, MAX_NUM_COLORS, PlacedPentomino } from "./../../constants";
import { expect, test } from "vitest";
import {
  decodeOrientation,
  decodeUrl,
  deserializeUrl,
  encodeOrientation,
  LETTERS_IN_ALPHABET,
  NUM_SPATIAL_ORIENTATIONS,
  serializeUrl,
} from "./urlConfig";
import { PENTOMINOES } from "../../pentominoes";

test("encoding works when there are no colors", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.X;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS })).toBe("8_8X03_3");
});

test("encoding terrain works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.R;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS })).toBe("8_8R03_3");
});

test("a URL is properly decoded when no pentominoes are placed", () => {
  expect(decodeUrl("8_8")).toStrictEqual({
    h: 8,
    w: 8,
    grid: [],
    colors: {},
  });
});

test("a URL is properly decoded with colors but no pentominoes", () => {
  expect(decodeUrl("8_8_1F")).toStrictEqual({
    h: 8,
    w: 8,
    grid: [],
    colors: { 1: ["F"] },
  });
});

test("a URL is properly decoded with colors and pentominoes", () => {
  expect(decodeUrl("8_8I04_4_1F")).toStrictEqual({
    h: 8,
    w: 8,
    grid: [
      {
        p: "I",
        r: "0",
        c: "4_4",
      },
    ],
    colors: { 1: ["F"] },
  });
});

test("a URL is properly decoded, no asymmetry", () => {
  expect(decodeUrl("8_8I04_4")).toStrictEqual({
    h: 8,
    w: 8,
    grid: [
      {
        p: "I",
        r: "0",
        c: "4_4",
      },
    ],
    colors: {},
  });
});

test("a URL is properly decoded, asymmetry", () => {
  expect(decodeUrl("6_10I04_6")).toStrictEqual({
    h: 6,
    w: 10,
    grid: [
      {
        p: "I",
        r: "0",
        c: "4_6",
      },
    ],
    colors: {},
  });
});

test("you get the right grid, no asymmetry", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(8, 8);
  grid[4][4].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("8_8I04_4")).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
  });
});

test("you get the right grid, asymmetry", () => {
  const grid: PlacedPentomino[][] = EMPTY_GRID(10, 6);
  grid[4][6].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("6_10I04_6")).toStrictEqual({
    grid: grid,
    colors: DEFAULT_COLORS,
  });
});

test("max num colors is small enough", () => {
  expect(LETTERS_IN_ALPHABET * 2 >= (MAX_NUM_COLORS - 1) * NUM_SPATIAL_ORIENTATIONS).toBe(true);
});

test("encode an orientation with color 0", () => {
  expect(encodeOrientation(0, 0, 0)).toBe("0");
  expect(encodeOrientation(1, 0, 0)).toBe("1");
  expect(encodeOrientation(1, 1, 0)).toBe("5");
});

test("encode an orientation in uppercase range", () => {
  expect(encodeOrientation(0, 0, 1)).toBe("A");
  expect(encodeOrientation(1, 0, 1)).toBe("B");
  expect(encodeOrientation(0, 0, 2)).toBe("I");

  expect(encodeOrientation(0, 0, 4)).toBe("Y");
  expect(encodeOrientation(1, 0, 4)).toBe("Z");
});

test("encode an orientation in lowercase range", () => {
  expect(encodeOrientation(2, 0, 4)).toBe("a");
});

test("decode an orientation with numerical color", () => {
  expect(decodeOrientation("0")).toStrictEqual({
    rotation: 0,
    reflection: 0,
    color: 0,
  });
  expect(decodeOrientation("5")).toStrictEqual({
    rotation: 1,
    reflection: 1,
    color: 0,
  });
  expect(decodeOrientation("1")).toStrictEqual({
    rotation: 1,
    reflection: 0,
    color: 0,
  });
});

test("decode an orientation with uppercase color", () => {
  expect(decodeOrientation("A")).toStrictEqual({
    rotation: 0,
    reflection: 0,
    color: 1,
  });
  expect(decodeOrientation("B")).toStrictEqual({
    rotation: 1,
    reflection: 0,
    color: 1,
  });
  expect(decodeOrientation("I")).toStrictEqual({
    rotation: 0,
    reflection: 0,
    color: 2,
  });
});

test("decode an orientation with lowercase color", () => {
  expect(decodeOrientation("a")).toStrictEqual({
    rotation: 2,
    reflection: 0,
    color: 4,
  });
});
