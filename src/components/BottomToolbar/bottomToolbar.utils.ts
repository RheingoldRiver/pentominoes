import { cloneDeep } from "lodash";
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

const adjacentCells: Coordinates[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

export function invalidSolve(gridToCheck: PlacedPentomino[][]) {
  const area = getAdjacentArea(gridToCheck);
  return area % 5 !== 0;
}

export function getAdjacentArea(gridToCheck: PlacedPentomino[][]) {
  const grid = cloneDeep(gridToCheck);
  const tileQueue: PlacedPentomino[] = [];
  let x = 0;
  let firstCell: PlacedPentomino;
  do {
    firstCell = grid[x][0];
    x++;
  } while (firstCell.pentomino.name !== PENTOMINOES.None.name);
  tileQueue.push(firstCell);
  let area = 0;
  firstCell.pentomino = PENTOMINOES.Found;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const curCell = tileQueue.pop();
    if (curCell === undefined) break;
    area++;
    adjacentCells.forEach(({ x, y }) => {
      const curX = curCell.coordinates.x + x;
      const curY = curCell.coordinates.y + y;
      if (curX < 0 || curX >= grid.length) return;
      if (curY < 0 || curY >= grid[0].length) return;
      const nextCell = grid[curX][curY];
      if (nextCell.pentomino.name !== PENTOMINOES.None.name) return;
      nextCell.pentomino = PENTOMINOES.Found;
      tileQueue.push(nextCell);
    });
  }
  return area;
}
