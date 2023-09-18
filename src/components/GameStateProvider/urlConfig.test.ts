import { range } from "lodash";
import { expect, test } from "vitest";
import { EMPTY_PENTOMINO, PlacedPentomino } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { decodeUrl, deserializeUrl } from "./urlConfig";

test("a URL is properly decoded, no asymmetry", () => {
  expect(decodeUrl("8.8I04.4")).toStrictEqual({
    h: 8,
    w: 8,
    g: [
      {
        p: "I",
        r: 0,
        c: "4.4",
      },
    ],
  });
});

test("you get the right grid, no asymmetry", () => {
  const grid: PlacedPentomino[][] = range(0, 8).map((x) =>
    range(0, 8).map((y) => {
      return EMPTY_PENTOMINO(x, y);
    })
  );
  grid[4][4].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("8.8I04.4")).toStrictEqual({
    h: 8,
    w: 8,
    g: grid,
  });
});

test("a URL is properly decoded, asymmetry", () => {
  expect(decodeUrl("6.10I04.6")).toStrictEqual({
    h: 6,
    w: 10,
    g: [
      {
        p: "I",
        r: 0,
        c: "4.6",
      },
    ],
  });
});

test("you get the right grid, asymmetry", () => {
  const grid: PlacedPentomino[][] = range(6).map((x) => range(10).map((y) => EMPTY_PENTOMINO(x, y)));
  grid[4][6].pentomino = PENTOMINOES["I"];
  expect(deserializeUrl("6.10I04.6")).toStrictEqual({
    h: 6,
    w: 10,
    g: grid,
  });
});
