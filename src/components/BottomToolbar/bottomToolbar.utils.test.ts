import { expect, test } from "vitest";
import { EMPTY_GRID } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import {
  cellIsBlocked,
  cornerIsValid,
  cornerIsValidSquare,
  getWrap,
  getXBlockPos,
  getXPos,
  getYBlockPos,
  getYPos,
  invalidSolve,
} from "./bottomToolbar.utils";

test("wrapping is correct", () => {
  const grid = EMPTY_GRID(8, 8);
  expect(getWrap(0, 0, grid, "x")).toBe(0);
  expect(getWrap(0, 1, grid, "x")).toBe(1);
  expect(getWrap(7, 0, grid, "x")).toBe(7);
  expect(getWrap(7, 1, grid, "x")).toBe(6);
});

test("getting x position is correct", () => {
  const grid = EMPTY_GRID(8, 8);
  expect(getXPos(0, 0, grid, "x")).toBe(0);
  expect(getYPos(0, 0, grid, "x")).toBe(1);
  expect(getXPos(0, 1, grid, "x")).toBe(1);
  expect(getYPos(0, 1, grid, "x")).toBe(1);
  expect(getXPos(0, 2, grid, "x")).toBe(2);
  expect(getYPos(0, 2, grid, "x")).toBe(1);

  expect(getXPos(0, 0, grid, "y")).toBe(1);
  expect(getYPos(0, 0, grid, "y")).toBe(0);
  expect(getXPos(0, 1, grid, "y")).toBe(1);
  expect(getYPos(0, 1, grid, "y")).toBe(1);
  expect(getXPos(0, 2, grid, "y")).toBe(1);
  expect(getYPos(0, 2, grid, "y")).toBe(2);
});

test("getting x position is correct on far end of axis", () => {
  const grid = EMPTY_GRID(8, 8);
  expect(getXPos(7, 0, grid, "x")).toBe(7);
  expect(getYPos(7, 0, grid, "x")).toBe(6);
  expect(getXPos(7, 1, grid, "x")).toBe(6);
  expect(getYPos(7, 1, grid, "x")).toBe(6);
  expect(getXPos(7, 2, grid, "x")).toBe(5);
  expect(getYPos(7, 2, grid, "x")).toBe(6);

  expect(getXPos(7, 0, grid, "y")).toBe(6);
  expect(getYPos(7, 0, grid, "y")).toBe(7);
  expect(getXPos(7, 1, grid, "y")).toBe(6);
  expect(getYPos(7, 1, grid, "y")).toBe(6);
  expect(getXPos(7, 2, grid, "y")).toBe(6);
  expect(getYPos(7, 2, grid, "y")).toBe(5);
});

test("finding the block position is correct", () => {
  const grid = EMPTY_GRID(8, 8);
  expect(getXBlockPos(0, 0, grid, "x")).toBe(1);
  expect(getYBlockPos(0, 0, grid, "x")).toBe(0);
  expect(getXBlockPos(0, 2, grid, "x")).toBe(3);
  expect(getYBlockPos(0, 2, grid, "x")).toBe(0);

  expect(getXBlockPos(0, 0, grid, "y")).toBe(0);
  expect(getYBlockPos(0, 0, grid, "y")).toBe(1);
  expect(getXBlockPos(0, 2, grid, "y")).toBe(0);
  expect(getYBlockPos(0, 2, grid, "y")).toBe(3);
});

test("negative control", () => {
  const grid = EMPTY_GRID(8, 8);
  expect(cellIsBlocked(grid, 0, 0)).toBe(false);
  expect(cellIsBlocked(grid, 1, 1)).toBe(false);
  expect(cellIsBlocked(grid, 7, 7)).toBe(false);
  expect(invalidSolve(grid)).toBe(false);
});

test("validating a corner properly: trivial case", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][1].pentomino = PENTOMINOES.R;
  grid[1][0].pentomino = PENTOMINOES.R;
  expect(cornerIsValid(grid, "x", { x: 0, y: 0 })).toBe(false);
  expect(cornerIsValid(grid, "y", { x: 0, y: 0 })).toBe(false);
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner properly: trivial case", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[6][0].pentomino = PENTOMINOES.R;
  grid[7][1].pentomino = PENTOMINOES.R;
  expect(cornerIsValid(grid, "x", { x: 7, y: 0 })).toBe(false);
  expect(cornerIsValid(grid, "y", { x: 7, y: 0 })).toBe(false);
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner properly: rectangle case", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][1].pentomino = PENTOMINOES.R;
  grid[1][1].pentomino = PENTOMINOES.R;
  grid[2][0].pentomino = PENTOMINOES.R;
  expect(cornerIsValid(grid, "x", { x: 0, y: 0 })).toBe(false);
  expect(cornerIsValid(grid, "y", { x: 0, y: 0 })).toBe(true);
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner properly: rectangle case 2", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[1][0].pentomino = PENTOMINOES.R;
  grid[1][1].pentomino = PENTOMINOES.R;
  grid[1][2].pentomino = PENTOMINOES.R;
  grid[0][3].pentomino = PENTOMINOES.R;
  expect(cornerIsValid(grid, "x", { x: 0, y: 0 })).toBe(true);
  expect(cornerIsValid(grid, "y", { x: 0, y: 0 })).toBe(false);
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
  expect(cellIsBlocked(grid, 4, 4)).toBe(true);
  expect(cellIsBlocked(grid, 5, 5)).toBe(false);
  expect(cellIsBlocked(grid, 4, 5)).toBe(false);
  expect(cellIsBlocked(grid, 1, 1)).toBe(false);
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a center properly", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][3].pentomino = PENTOMINOES.R;
  grid[0][1].pentomino = PENTOMINOES.R;
  grid[1][2].pentomino = PENTOMINOES.R;
  expect(invalidSolve(grid)).toBe(true);
});

test("validating a corner 2x2 square", () => {
  const grid = EMPTY_GRID(8, 8);
  grid[0][2].pentomino = PENTOMINOES.R;
  grid[1][2].pentomino = PENTOMINOES.R;
  grid[2][0].pentomino = PENTOMINOES.R;
  grid[2][1].pentomino = PENTOMINOES.R;
  expect(cornerIsValidSquare(grid, { x: 0, y: 0 })).toBe(false);
  expect(invalidSolve(grid)).toBe(true);

  const grid2 = EMPTY_GRID(8, 8);
  grid2[0][5].pentomino = PENTOMINOES.R;
  grid2[1][5].pentomino = PENTOMINOES.R;
  grid2[2][7].pentomino = PENTOMINOES.R;
  grid2[2][6].pentomino = PENTOMINOES.R;
  expect(cornerIsValidSquare(grid2, { x: 0, y: 7 })).toBe(false);
  expect(invalidSolve(grid2)).toBe(true);
});
