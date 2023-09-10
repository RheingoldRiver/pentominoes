import { Coordinates } from "./constants";

export interface Pentomino {
  name: string;
  center: Coordinates;
  shape: number[][];
}

interface Pentominoes {
  [key: string]: Pentomino;
}

export const PENTOMINOES: Pentominoes = {
  "": {
    name: "",
    center: {
      x: 0,
      y: 0,
    },
    shape: [[0]],
  },
  F: {
    name: "F",
    center: {
      x: 1,
      y: 1,
    },
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  I: {
    name: "I",
    center: {
      x: 2,
      y: 0,
    },
    shape: [[1], [1], [1], [1], [1]],
  },
  P: {
    name: "P",
    center: {
      x: 1,
      y: 1,
    },
    shape: [
      [1, 1, 0],
      [1, 1, 1],
    ],
  },
};
