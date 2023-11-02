import { expect, test } from "vitest";
import { EMPTY_GRID } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { getAdjacentArea, invalidSolve } from "./bottomToolbar.utils";

test("negative control", () => {
  const grid = EMPTY_GRID(8, 8);
  expect(getAdjacentArea(grid)).toBe(64);
});

test("works with some random tiles", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][1].pentomino = PENTOMINOES.R;
  grid[5][6].pentomino = PENTOMINOES.R;
  grid[2][3].pentomino = PENTOMINOES.R;
  grid[7][7].pentomino = PENTOMINOES.R;
  expect(getAdjacentArea(grid)).toBe(60);
  expect(invalidSolve(grid)).toBe(false);
});

test("validating a corner properly: trivial case", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][1].pentomino = PENTOMINOES.R;
  grid[1][0].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner properly: trivial case", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[6][0].pentomino = PENTOMINOES.R;
  grid[7][1].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner properly: rectangle case", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][1].pentomino = PENTOMINOES.R;
  grid[1][1].pentomino = PENTOMINOES.R;
  grid[2][0].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner properly: rectangle case 2", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[1][0].pentomino = PENTOMINOES.R;
  grid[1][1].pentomino = PENTOMINOES.R;
  grid[1][2].pentomino = PENTOMINOES.R;
  grid[0][3].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a diagonal corner properly", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][2].pentomino = PENTOMINOES.R;
  grid[1][1].pentomino = PENTOMINOES.R;
  grid[2][0].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);

  const grid2 = EMPTY_GRID(8, 8);
  grid2[3][0].pentomino = PENTOMINOES.R;
  grid2[2][1].pentomino = PENTOMINOES.R;
  grid2[1][2].pentomino = PENTOMINOES.R;
  grid2[0][3].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid2)).toBe(true);
});

test("validating a center properly", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[4][5].pentomino = PENTOMINOES.R;
  grid[4][3].pentomino = PENTOMINOES.R;
  grid[3][4].pentomino = PENTOMINOES.R;
  grid[5][4].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a center properly", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][3].pentomino = PENTOMINOES.R;
  grid[0][1].pentomino = PENTOMINOES.R;
  grid[1][2].pentomino = PENTOMINOES.R;
  grid[7][7].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner 2x2 square", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][2].pentomino = PENTOMINOES.R;
  grid[1][2].pentomino = PENTOMINOES.R;
  grid[2][0].pentomino = PENTOMINOES.R;
  grid[2][1].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);

  const grid2 = EMPTY_GRID(8, 8);
  grid2[0][5].pentomino = PENTOMINOES.R;
  grid2[1][5].pentomino = PENTOMINOES.R;
  grid2[2][7].pentomino = PENTOMINOES.R;
  grid2[2][6].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid2)).toBe(true);
});
