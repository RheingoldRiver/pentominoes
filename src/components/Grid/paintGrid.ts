import { range } from "lodash";
import { PENTOMINOES } from "../../pentominoes";
import { EMPTY_PENTOMINO, PaintedCell, PlacedPentomino, Surface } from "../../constants";

interface NewCoordinates {
  newX: number;
  newY: number;
}

export function getPaintedBoard(grid: PlacedPentomino[][], surface: Surface): PaintedCell[][] {
  const paintedGrid: PaintedCell[][] = range(grid.length).map((x) =>
    range(grid[0].length).map((y) => {
      return {
        pentomino: EMPTY_PENTOMINO(x, y),
        conflict: false,
        borderTop: false,
        borderLeft: false,
        borderBot: false,
        borderRight: false,
      };
    })
  );
  // Update the painted grid
  grid.forEach((r, x) =>
    r.forEach((p, y) => {
      if (p.pentomino.name === PENTOMINOES.None.name) return;
      const orientation = p.pentomino.orientations[p.reflection][p.rotation];
      orientation.shape.forEach((pr, px) =>
        pr.forEach((val, py) => {
          if (val === 0) return; // the pentomino isn't taking up this square of its grid, return
          const rawX = x + px - orientation.center.x;
          const rawY = y + py - orientation.center.y;
          const { newX, newY } = getCoordinatesToPaint(surface, grid.length, grid[0].length, rawX, rawY);

          if (checkOutOfBounds(grid, paintedGrid, newX, newY)) return;

          // ok should be a valid placement now
          const cellToPaint = paintedGrid[newX][newY];
          if (cellToPaint.pentomino.pentomino.name !== PENTOMINOES.None.name) {
            cellToPaint.conflict = true;
          }
          cellToPaint.pentomino = p;
          if (px === 0 || orientation.shape[px - 1][py] === 0) cellToPaint.borderTop = true;
          if (py === 0 || orientation.shape[px][py - 1] === 0) cellToPaint.borderLeft = true;
          if (px === orientation.shape.length - 1 || orientation.shape[px + 1][py] === 0) cellToPaint.borderBot = true;
          if (py === orientation.shape[0].length - 1 || orientation.shape[px][py + 1] === 0)
            cellToPaint.borderRight = true;
        })
      );
    })
  );
  return paintedGrid;
}

export function getCoordinatesToPaint(
  surface: Surface,
  height: number,
  width: number,
  rawX: number,
  rawY: number
): NewCoordinates {
  switch (surface) {
    case Surface.Rectangle:
      return {
        newX: rawX,
        newY: rawY,
      };
    case Surface.KleinBottle:
      return {
        newX: outOfBounds(rawY, height) ? orient(wrap(rawX, height), height) : wrap(rawX, height),
        newY: wrap(rawY, width),
      };
    case Surface.ProjectivePlane:
      return {
        newX: outOfBounds(rawY, height) ? orient(wrap(rawX, height), height) : wrap(rawX, height),
        newY: outOfBounds(rawX, width) ? orient(wrap(rawY, width), width) : wrap(rawY, width),
      };
    case Surface.Torus:
      return {
        newX: wrap(rawX, width),
        newY: wrap(rawY, width),
      };
  }
}

export function outOfBounds(coord: number, dim: number): boolean {
  return coord > dim - 1 || coord < 0;
}

export function wrap(coord: number, dim: number): number {
  if (coord > dim - 1) return coord - dim;
  if (coord < 0) return dim + coord;
  return coord;
}

export function orient(coord: number, dim: number): number {
  return dim - 1 - coord;
}

function checkOutOfBounds(
  grid: PlacedPentomino[][],
  paintedGrid: PaintedCell[][],
  newX: number,
  newY: number
): boolean {
  const height = grid.length;
  const width = grid[0].length;

  // error check
  if (newX < 0 || newX > height - 1) {
    const correctedX = newX < 0 ? 0 : height - 1;
    if (newY < 0) {
      paintedGrid[correctedX][0].conflict = true;
    } else if (newY > width - 1) {
      paintedGrid[correctedX][width - 1].conflict = true;
    } else {
      paintedGrid[correctedX][newY].conflict = true;
    }
    return true;
  }
  if (newY < 0) {
    paintedGrid[newX][0].conflict = true;
    return true;
  }
  if (newY > width - 1) {
    paintedGrid[newX][width - 1].conflict = true;
    return true;
  }
  return false;
}
