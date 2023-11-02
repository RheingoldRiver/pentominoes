import { range } from "lodash";
import { Dimensions, PlacedPentomino } from "../../constants";
import { Coordinates, PENTOMINOES } from "../../pentominoes";

export const PRESET_SIZES: Dimensions[] = [
  {
    height: 8,
    width: 8,
  },
  {
    height: 5,
    width: 12,
  },
  {
    height: 6,
    width: 10,
  },
  {
    height: 12,
    width: 5,
  },
  {
    height: 10,
    width: 6,
  },
];

export const RANDOM_TERRAIN_ALLOWED: Dimensions = {
  height: 8,
  width: 8,
};

export function invalidSolve(grid: PlacedPentomino[][]) {
  let invalid = false;
  grid.forEach((row, x) =>
    row.forEach((c, y) => {
      // a cell which is itself terrain can't be the center of an invalid cluster
      if (c.pentomino.name !== PENTOMINOES.None.name) return;
      if (cellIsBlocked(grid, x, y)) invalid = true;
    })
  );
  if (invalid) return true;
  const corners = [
    { x: 0, y: 0 },
    { x: grid.length - 1, y: 0 },
    { x: 0, y: grid[0].length - 1 },
    { x: grid.length - 1, y: grid[0].length - 1 },
  ];
  corners.forEach((coords) => {
    ["x", "y"].forEach((dim) => {
      if (!cornerIsValid(grid, dim as keyof Coordinates, coords)) invalid = true;
    });
    if (!cornerIsValidDiagonal(grid, coords)) invalid = true;
    if (!cornerIsValidSquare(grid, coords)) invalid = true;
  });
  return invalid;
}

const middleCellInvalidState: Coordinates[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const maxRangeToCheck = 3;

export function cellIsBlocked(grid: PlacedPentomino[][], x: number, y: number) {
  let isBlocked = true;
  middleCellInvalidState.forEach((coords) => {
    const curX = coords.x + x;
    const curY = coords.y + y;
    if (!(0 <= curX && curX < grid.length)) return;
    if (!(0 <= curY && curY < grid[0].length)) return;
    if (grid[curX][curY].pentomino.name === PENTOMINOES.None.name) isBlocked = false;
  });
  return isBlocked;
}

export function getWrap(dimValue: number, offset: number, grid: PlacedPentomino[][], dim: keyof Coordinates) {
  if (dimValue === 0) return offset;
  return (dim === "x" ? grid.length : grid[0].length) - 1 - offset;
}

export function getXPos(dimValue: number, offset: number, grid: PlacedPentomino[][], dim: keyof Coordinates) {
  if (dim === "x") return getWrap(dimValue, offset, grid, dim);
  return getWrap(dimValue, 1, grid, dim);
}

export function getYPos(dimValue: number, offset: number, grid: PlacedPentomino[][], dim: keyof Coordinates) {
  if (dim === "y") return getWrap(dimValue, offset, grid, dim);
  return getWrap(dimValue, 1, grid, dim);
}

export function getXBlockPos(dimValue: number, offset: number, grid: PlacedPentomino[][], dim: keyof Coordinates) {
  if (dim === "y") return dimValue;
  return getWrap(dimValue, offset + 1, grid, dim);
}

export function getYBlockPos(dimValue: number, offset: number, grid: PlacedPentomino[][], dim: keyof Coordinates) {
  if (dim === "x") return dimValue;
  return getWrap(dimValue, offset + 1, grid, dim);
}

export function cornerIsValid(grid: PlacedPentomino[][], dim: keyof Coordinates, startingCoords: Coordinates) {
  let valid = false;
  let foundBlock = false;

  const { x, y } = startingCoords;

  const xPos = (dimValue: number, offset: number) => {
    return getXPos(dimValue, offset, grid, dim);
  };

  const yPos = (dimValue: number, offset: number) => {
    return getYPos(dimValue, offset, grid, dim);
  };

  const xBlockPos = (dimValue: number, offset: number) => {
    return getXBlockPos(dimValue, offset, grid, dim);
  };

  const yBlockPos = (dimValue: number, offset: number) => {
    return getYBlockPos(dimValue, offset, grid, dim);
  };

  if (grid[x][y].pentomino.name !== PENTOMINOES.None.name) return true;
  range(maxRangeToCheck).forEach((i) => {
    if (grid[xPos(x, i)][yPos(y, i)].pentomino.name === PENTOMINOES.None.name) {
      valid = !foundBlock;
      return;
    }
    if (grid[xBlockPos(x, i)][yBlockPos(y, i)].pentomino.name !== PENTOMINOES.None.name) {
      foundBlock = true;
      return;
    }
  });
  if (valid) return true;
  return !foundBlock;
}

export function cornerIsValidDiagonal(grid: PlacedPentomino[][], startingCoords: Coordinates) {
  const valid = [
    {
      len: 3,
      result: false,
    },
    {
      len: 4,
      result: false,
    },
  ];
  const { x, y } = startingCoords;
  valid.forEach((val) => {
    range(val.len).forEach((i) => {
      const cell = grid[getWrap(x, val.len - 1 - i, grid, "x")][getWrap(y, i, grid, "y")];
      if (cell.pentomino.name === PENTOMINOES.None.name) {
        val.result = true;
      }
    });
  });
  return valid.reduce((acc, val) => {
    return acc && val.result;
  }, true);
}

export function cornerIsValidSquare(grid: PlacedPentomino[][], startingCoords: Coordinates) {
  let valid = false;
  const { x, y } = startingCoords;
  range(2).forEach((i) => {
    const cell1 = grid[getWrap(x, 2, grid, "x")][getWrap(y, i, grid, "y")];
    if (cell1.pentomino.name === PENTOMINOES.None.name) valid = true;
    const cell2 = grid[getWrap(x, i, grid, "x")][getWrap(y, 2, grid, "y")];
    if (cell2.pentomino.name === PENTOMINOES.None.name) valid = true;
  });
  return valid;
}
