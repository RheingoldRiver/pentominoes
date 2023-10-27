import { ConflictType, EMPTY_GRID } from "./../../constants";
import { expect, test } from "vitest";
import { SURFACES } from "../../constants";
import {
  consecutiveOrientableWrap,
  emptyPaintedGrid,
  getCoordinatesToPaint,
  orient,
  paintCell,
  wrap,
} from "./paintGrid";
import { PENTOMINOES } from "../../pentominoes";

test("a nonorientable coordinate is moved properly", () => {
  expect(orient(5, 8)).toBe(2);
  expect(orient(0, 8)).toBe(7);
  expect(orient(7, 8)).toBe(0);
});

test("a coordinate wraps properly", () => {
  expect(wrap(8, 8)).toBe(0);
  expect(wrap(9, 8)).toBe(1);
  expect(wrap(-1, 8)).toBe(7);
  expect(wrap(-2, 8)).toBe(6);
});

test("orientable coordinates wrap properly", () => {
  expect(getCoordinatesToPaint(SURFACES.Torus, 8, 8, 8, 5)).toStrictEqual({ newX: 0, newY: 5 });
  expect(getCoordinatesToPaint(SURFACES.Torus, 8, 8, -1, 5)).toStrictEqual({ newX: 7, newY: 5 });
  expect(getCoordinatesToPaint(SURFACES.Torus, 8, 8, 5, 8)).toStrictEqual({ newX: 5, newY: 0 });
  expect(getCoordinatesToPaint(SURFACES.Torus, 8, 8, 5, -1)).toStrictEqual({ newX: 5, newY: 7 });
  expect(getCoordinatesToPaint(SURFACES.Torus, 8, 8, 8, 8)).toStrictEqual({ newX: 0, newY: 0 });
  expect(getCoordinatesToPaint(SURFACES.Torus, 8, 8, -1, -1)).toStrictEqual({ newX: 7, newY: 7 });
});

test("nonorientable x coordinate wraps properly", () => {
  expect(getCoordinatesToPaint(SURFACES.ProjectivePlane, 8, 8, 8, 5)).toStrictEqual({ newX: 0, newY: 2 });
  expect(getCoordinatesToPaint(SURFACES.ProjectivePlane, 8, 8, -1, 5)).toStrictEqual({ newX: 7, newY: 2 });
  expect(getCoordinatesToPaint(SURFACES.ProjectivePlane, 8, 8, 8, 7)).toStrictEqual({ newX: 0, newY: 0 });
  expect(getCoordinatesToPaint(SURFACES.ProjectivePlane, 8, 8, -1, 0)).toStrictEqual({ newX: 7, newY: 7 });
  expect(getCoordinatesToPaint(SURFACES.ProjectivePlane, 8, 8, 8, 7)).toStrictEqual({ newX: 0, newY: 0 });
  expect(getCoordinatesToPaint(SURFACES.ProjectivePlane, 8, 8, -1, 0)).toStrictEqual({ newX: 7, newY: 7 });
});

test("a sphere maps correctly", () => {
  expect(consecutiveOrientableWrap(-1, 8, 1)).toBe(6);
});

test("no incorrect conflicts where 2 pieces touch", () => {
  const grid = EMPTY_GRID(8, 8);
  const paintedGrid = emptyPaintedGrid(8, 8);
  paintCell(
    paintedGrid,
    {
      coordinates: { x: 0, y: 0 },
      pentomino: PENTOMINOES.F,
      orientation: {
        rotation: 0,
        reflection: 0,
      },
    },
    SURFACES.Rectangle,
    grid,
    false
  );
  paintCell(
    paintedGrid,
    {
      coordinates: { x: 4, y: 1 },
      pentomino: PENTOMINOES.V,
      orientation: {
        rotation: 0,
        reflection: 0,
      },
    },
    SURFACES.Rectangle,
    grid,
    false
  );
  paintCell(
    paintedGrid,
    {
      coordinates: { x: 2, y: 1 },
      pentomino: PENTOMINOES.I,
      orientation: {
        rotation: 0,
        reflection: 0,
      },
    },
    SURFACES.Rectangle,
    grid,
    false
  );
  expect(paintedGrid[0][1].conflict).toStrictEqual({
    tileName: "F",
    type: ConflictType.Overflow,
  });
  expect(paintedGrid[0][0].conflict).toStrictEqual({
    tileName: "F",
    type: ConflictType.Overflow,
  });
  expect(paintedGrid[4][1].conflict).toStrictEqual({
    tileName: "V",
    type: ConflictType.Intersection,
  });
  expect(paintedGrid[3][1].conflict).toStrictEqual({
    tileName: "V",
    type: ConflictType.Intersection,
  });
});
