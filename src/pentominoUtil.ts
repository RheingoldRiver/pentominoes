import { cloneDeep, range } from "lodash";
import { Coordinates } from "./pentominoes";

export function center(shape: number[][]) {
  const ret: Coordinates = {
    x: -1,
    y: -1,
  };
  shape.map((row, x) =>
    row.map((cell, y) => {
      if (cell === 2) {
        ret.x = x;
        ret.y = y;
      }
    })
  );
  return ret;
}

export function reflectX(shape: number[][]) {
  const ret = cloneDeep(shape);
  shape.map((row, x) =>
    row.map((_, y) => {
      ret[x][y] = shape[shape.length - 1 - x][y];
    })
  );
  return ret;
}

export function rotateRight(shape: number[][]) {
  const ret: number[][] = [];
  // this is super bs because typescript is yelling at me if i try to just
  // map it all at once
  range(0, shape[0].length).map(() => {
    ret.push([]);
  });
  range(0, shape[0].length).map((newX) => {
    range(0, shape.length).map(() => {
      ret[newX].push(-1);
    });
  });
  shape.map((row, x) =>
    row.map((_, y) => {
      ret[y][x] = shape[shape.length - 1 - x][y];
    })
  );
  return ret;
}
