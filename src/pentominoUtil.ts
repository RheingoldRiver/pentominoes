import { cloneDeep, range } from "lodash";
import { Coordinates } from "./pentominoes";

export function center(shape: number[][]) {
  const ret: Coordinates = {
    x: -1,
    y: -1,
  };
  shape.forEach((row, x) =>
    row.forEach((cell, y) => {
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
  shape.forEach((row, x) =>
    row.forEach((_, y) => {
      ret[x][y] = shape[shape.length - 1 - x][y];
    })
  );
  return ret;
}

export function rotateRight(shape: number[][]) {
  const ret: number[][] = range(0, shape[0].length).reduce((acc: number[][]) => {
    acc.push(
      range(0, shape.length).reduce((acc2: number[]) => {
        acc2.push(-1);
        return acc2;
      }, [])
    );
    return acc;
  }, []);
  shape.forEach((row, x) =>
    row.forEach((_, y) => {
      ret[y][x] = shape[shape.length - 1 - x][y];
    })
  );
  return ret;
}
