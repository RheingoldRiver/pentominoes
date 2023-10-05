import { DEFAULT_COLORS, EMPTY_GRID, Surface } from "./../../constants";
import { expect, test } from "vitest";
import { decodeUrl, serializeUrl } from "./urlConfig";
import { PENTOMINOES } from "../../pentominoes";
import { range } from "lodash";

test("normal encoding terrain works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.R;
  grid[4][4].pentomino = PENTOMINOES.R;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: Surface.Torus })).toBe("T88R3344");
});

test("width encoding terrain works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.R;
  grid[3][4].pentomino = PENTOMINOES.R;
  grid[3][5].pentomino = PENTOMINOES.R;
  grid[3][6].pentomino = PENTOMINOES.R;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: Surface.Torus })).toBe("T88RZ333456");
});

test("height encoding terrain works", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[3][3].pentomino = PENTOMINOES.R;
  grid[4][3].pentomino = PENTOMINOES.R;
  grid[5][3].pentomino = PENTOMINOES.R;
  grid[6][3].pentomino = PENTOMINOES.R;
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: Surface.Torus })).toBe("T88RY333456");
});

test("terrain properly strips 0 when needed", () => {
  const grid = EMPTY_GRID(8, 8);
  range(4, 8).forEach((c) => (grid[c][c].pentomino = PENTOMINOES.R));
  range(0, 4).forEach((y) => {
    grid[0][y].pentomino = PENTOMINOES.R;
    grid[1][y].pentomino = PENTOMINOES.R;
  });
  expect(serializeUrl({ grid, colors: DEFAULT_COLORS, surface: Surface.Torus })).toBe(
    `${"T88"}${"RZ"}${"300123"}${"310123"}${"044556677"}`
  );
});

test("decoding terrain (no direction) works", () => {
  expect(decodeUrl("T88R0001")).toStrictEqual({
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
    ],
    colors: {},
    surface: Surface.Torus,
  });
});

test("decoding terrain (width) works", () => {
  expect(decodeUrl("T88RZ1001")).toStrictEqual({
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
    ],
    colors: {},
    surface: Surface.Torus,
  });
});

test("decoding terrain (height) works", () => {
  expect(decodeUrl("T88RY1001")).toStrictEqual({
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
    ],
    colors: {},
    surface: Surface.Torus,
  });
});
