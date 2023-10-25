import { PlacedPentomino } from "./../../constants";
import { Borders, PaintedCell } from "../../constants";
import { range } from "lodash";
import { PENTOMINOES } from "../../pentominoes";
import { EMPTY_PENTOMINO, Orientation, SURFACES, Surface } from "../../constants";

interface NewCoordinates {
  newX: number;
  newY: number;
}

export function getPaintedBoard(
  grid: PlacedPentomino[][],
  surface: Surface,
  currentPlacedPentomino: PlacedPentomino | undefined,
  boardHovered: boolean
): PaintedCell[][] {
  const paintedGrid: PaintedCell[][] = emptyPaintedGrid(grid.length, grid[0].length);
  // Update the painted grid
  grid.forEach((r) =>
    r.forEach((p) => {
      if (p.pentomino.name === PENTOMINOES.None.name) return;
      paintCell(paintedGrid, p, surface, grid, false);
    })
  );
  if (currentPlacedPentomino === undefined) return paintedGrid;
  if (
    boardHovered &&
    paintedGrid[currentPlacedPentomino.x][currentPlacedPentomino.y].pentomino.pentomino.name === PENTOMINOES.None.name
  ) {
    paintCell(paintedGrid, currentPlacedPentomino, surface, grid, true);
  }
  return paintedGrid;
}

export const emptyPaintedGrid = (h: number, w: number): PaintedCell[][] => {
  return range(h).map((x) =>
    range(w).map((y) => {
      return {
        pentomino: EMPTY_PENTOMINO(x, y),
        conflict: false,
        center: false,
        borders: {
          borderTop: false,
          borderLeft: false,
          borderBot: false,
          borderRight: false,
        },
        hovered: false,
      };
    })
  );
};

export const paintCell = (
  paintedGrid: PaintedCell[][],
  p: PlacedPentomino,
  surface: Surface,
  grid: PlacedPentomino[][],
  hovered: boolean
) => {
  const orientation = p.pentomino.orientations[p.reflection][p.rotation];
  orientation.shape.forEach((pr, px) =>
    pr.forEach((val, py) => {
      if (val === 0) return; // the pentomino isn't taking up this square of its grid, return
      const rawX = p.x + px - orientation.center.x;
      const rawY = p.y + py - orientation.center.y;
      const height = grid.length;
      const width = grid[0].length;
      const { newX, newY } = getCoordinatesToPaint(surface, height, width, rawX, rawY);

      if (checkOutOfBounds(grid, paintedGrid, newX, newY)) return;

      // ok should be a valid placement now
      const cellToPaint = paintedGrid[newX][newY];
      cellToPaint.hovered = hovered;
      cellToPaint.center = px === orientation.center.x && py === orientation.center.y;
      if (cellToPaint.pentomino.pentomino.name !== PENTOMINOES.None.name) {
        cellToPaint.conflict = true;
      }
      cellToPaint.pentomino = p;
      const flipX = outOfBounds(rawY, width) && surface.orientation.h === Orientation.Nonorientable;
      const flipY = outOfBounds(rawX, height) && surface.orientation.w === Orientation.Nonorientable;
      const transposeX = outOfBounds(rawX, width) && surface.consecutive;
      const transposeY = outOfBounds(rawY, height) && surface.consecutive;

      if (px === 0 || orientation.shape[px - 1][py] === 0) {
        cellToPaint.borders[border("borderTop", flipX, transposeX, transposeY)] = true;
      }
      if (py === 0 || orientation.shape[px][py - 1] === 0) {
        cellToPaint.borders[border("borderLeft", flipY, transposeX, transposeY)] = true;
      }
      if (px === orientation.shape.length - 1 || orientation.shape[px + 1][py] === 0) {
        cellToPaint.borders[border("borderBot", flipX, transposeX, transposeY)] = true;
      }
      if (py === orientation.shape[0].length - 1 || orientation.shape[px][py + 1] === 0) {
        cellToPaint.borders[border("borderRight", flipY, transposeX, transposeY)] = true;
      }
    })
  );
};

const flipMap: { [key: string]: string } = {
  borderRight: "borderLeft",
  borderLeft: "borderRight",
  borderTop: "borderBot",
  borderBot: "borderTop",
};

const transposeMapX: { [key: string]: string } = {
  borderRight: "borderTop",
  borderBot: "borderRight",
  borderTop: "borderLeft",
  borderLeft: "borderBot",
};

const transposeMapY: { [key: string]: string } = {
  borderRight: "borderBot",
  borderBot: "borderLeft",
  borderTop: "borderRight",
  borderLeft: "borderTop",
};

function border(val: string, flip: boolean, transposeX: boolean, transposeY: boolean): keyof Borders {
  if (flip) val = flipMap[val];
  if (transposeX) val = transposeMapX[val];
  if (transposeY) val = transposeMapY[val];
  return val as keyof Borders;
}

export function getCoordinatesToPaint(
  surface: Surface,
  height: number,
  width: number,
  rawX: number,
  rawY: number
): NewCoordinates {
  switch (surface) {
    case SURFACES.Rectangle:
      return {
        newX: rawX,
        newY: rawY,
      };
    case SURFACES.Cylinder:
      return {
        newX: rawX,
        newY: wrap(rawY, width),
      };
    case SURFACES.Mobius:
      return {
        newX: outOfBounds(rawX, height) ? rawX : nonorientableWrap(rawX, height, rawY, width),
        newY: wrap(rawY, width),
      };
    case SURFACES.KleinBottle:
      return {
        newX: nonorientableWrap(rawX, height, rawY, width),
        newY: wrap(rawY, width),
      };
    case SURFACES.ProjectivePlane:
      return {
        newX: nonorientableWrap(rawX, height, rawY, width),
        newY: nonorientableWrap(rawY, width, rawX, height),
      };
    case SURFACES.Torus:
      return {
        newX: wrap(rawX, width),
        newY: wrap(rawY, width),
      };
    case SURFACES.Sphere:
      return {
        newX: consecutiveOrientableWrap(rawX, height, rawY),
        newY: consecutiveOrientableWrap(rawY, width, rawX),
      };
  }
  return { newX: rawX, newY: rawY };
}

export function consecutiveOrientableWrap(coord: number, dim: number, oppositeCoord: number) {
  if (outOfBounds(coord, dim)) {
    return dim - 1 - wrap(oppositeCoord, dim);
  }
  if (outOfBounds(oppositeCoord, dim)) {
    return wrap(oppositeCoord, dim);
  }
  return coord;
}

export function nonorientableWrap(coord: number, dim: number, oppositeCoord: number, oppositeDim: number) {
  return outOfBounds(oppositeCoord, oppositeDim) ? orient(wrap(coord, dim), dim) : wrap(coord, dim);
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
