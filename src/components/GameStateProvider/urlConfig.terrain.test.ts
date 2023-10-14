import { expect, test } from "vitest";
import { StringifiedPlacedPentomino, decodeUrl, serializeUrl } from "./urlConfig";
import { DEFAULT_COLORS, EMPTY_GRID, SURFACES } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { range } from "lodash";

function decodedTerrain(c: string): StringifiedPlacedPentomino {
  return {
    p: "R",
    r: "0",
    c: c,
  };
}

test("normal encoding terrain works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.R;
  grid[4][4].pentomino = PENTOMINOES.R;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: SURFACES.Torus })).toBe("T88R3344");
});

test("width encoding terrain works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.R;
  grid[3][4].pentomino = PENTOMINOES.R;
  grid[3][5].pentomino = PENTOMINOES.R;
  grid[3][6].pentomino = PENTOMINOES.R;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: SURFACES.Torus })).toBe("T88RZ333456");
});

test("height encoding terrain works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.R;
  grid[4][3].pentomino = PENTOMINOES.R;
  grid[5][3].pentomino = PENTOMINOES.R;
  grid[6][3].pentomino = PENTOMINOES.R;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: SURFACES.Torus })).toBe("T88RY333456");
});

test("terrain properly strips 0 when needed (Z)", () => {
  const grid = EMPTY_GRID(8, 8);
  range(4, 8).forEach((c) => (grid[c][c].pentomino = PENTOMINOES.R));
  range(0, 4).forEach((y) => {
    grid[0][y].pentomino = PENTOMINOES.R;
    grid[1][y].pentomino = PENTOMINOES.R;
  });
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: SURFACES.Torus })).toBe(
    `${"T88"}${"RZ"}${"300123"}${"310123"}${"044556677"}`
  );
});

test("decoding terrain properly understands stripping 0", () => {
  expect(4).toBe(4);
  expect(decodeUrl(`${"T88"}${"RZ"}${"300123"}${"310123"}${"044556677"}`).pentominoes).toStrictEqual([
    decodedTerrain("0_0"),
    decodedTerrain("0_1"),
    decodedTerrain("0_2"),
    decodedTerrain("0_3"),
    decodedTerrain("1_0"),
    decodedTerrain("1_1"),
    decodedTerrain("1_2"),
    decodedTerrain("1_3"),
    decodedTerrain("4_4"),
    decodedTerrain("5_5"),
    decodedTerrain("6_6"),
    decodedTerrain("7_7"),
  ]);
});

test("decoding terrain (no direction) works", () => {
  expect(decodeUrl("T88R0001")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [decodedTerrain("0_0"), decodedTerrain("0_1")],
    colors: {},
    surface: SURFACES.Torus,
  });
});

test("decoding terrain (width) works", () => {
  expect(decodeUrl("T88RZ10011551")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "R",
        r: "0",
        c: "0_0",
      },
      {
        p: "R",
        r: "0",
        c: "0_1",
      },
      {
        p: "R",
        r: "0",
        c: "5_5",
      },
      {
        p: "R",
        r: "0",
        c: "5_1",
      },
    ],
    colors: {},
    surface: SURFACES.Torus,
  });
});

test("decoding terrain (width) works when there are also pentominoes", () => {
  expect(decodeUrl("T88P055RZ10011551")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "P",
        r: "0",
        c: "5_5",
      },
      {
        p: "R",
        r: "0",
        c: "0_0",
      },
      {
        p: "R",
        r: "0",
        c: "0_1",
      },
      {
        p: "R",
        r: "0",
        c: "5_5",
      },
      {
        p: "R",
        r: "0",
        c: "5_1",
      },
    ],
    colors: {},
    surface: SURFACES.Torus,
  });
});

test("decoding terrain (height) works", () => {
  expect(decodeUrl(`${"T88"}${"RY"}${"1001"}${"1551"}`)).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "R",
        r: "0",
        c: "0_0",
      },
      {
        p: "R",
        r: "0",
        c: "1_0",
      },
      {
        p: "R",
        r: "0",
        c: "5_5",
      },
      {
        p: "R",
        r: "0",
        c: "1_5",
      },
    ],
    colors: {},
    surface: SURFACES.Torus,
  });
});

test("decoding terrain (height) works when there are also pentominoes", () => {
  expect(decodeUrl("T88P055RY10011551")).toStrictEqual({
    h: 8,
    w: 8,
    pentominoes: [
      {
        p: "P",
        r: "0",
        c: "5_5",
      },
      {
        p: "R",
        r: "0",
        c: "0_0",
      },
      {
        p: "R",
        r: "0",
        c: "1_0",
      },
      {
        p: "R",
        r: "0",
        c: "5_5",
      },
      {
        p: "R",
        r: "0",
        c: "1_5",
      },
    ],
    colors: {},
    surface: SURFACES.Torus,
  });
});
