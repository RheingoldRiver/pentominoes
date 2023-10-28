import { range } from "lodash";
import { center, reflectX, rotateRight } from "./pentominoUtil";

export interface Coordinates {
  x: number;
  y: number;
}

export interface Shape {
  center: Coordinates;
  shape: number[][];
}

interface Shapes {
  [key: number]: Shape[];
}

export interface Pentomino {
  name: string;
  shapes: Shapes;
}

interface Pentominoes {
  [key: string]: Pentomino;
}

interface PentominoPrimitive {
  name: string;
  shape: number[][];
}

const pentominoPrimitives: PentominoPrimitive[] = [
  {
    name: "F",
    shape: [
      [0, 1, 1],
      [1, 2, 0],
      [0, 1, 0],
    ],
  },
  {
    name: "I",
    shape: [[1], [1], [2], [1], [1]],
  },
  {
    name: "L",
    shape: [
      [1, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ],
  },
  {
    name: "P",
    shape: [
      [1, 1],
      [1, 2],
      [1, 0],
    ],
  },
  {
    name: "N",
    shape: [
      [0, 1],
      [2, 1],
      [1, 0],
      [1, 0],
    ],
  },
  {
    name: "T",
    shape: [
      [1, 2, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    name: "U",
    shape: [
      [1, 0, 1],
      [1, 2, 1],
    ],
  },
  {
    name: "V",
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [2, 1, 1],
    ],
  },
  {
    name: "W",
    shape: [
      [1, 0, 0],
      [1, 2, 0],
      [0, 1, 1],
    ],
  },
  {
    name: "X",
    shape: [
      [0, 1, 0],
      [1, 2, 1],
      [0, 1, 0],
    ],
  },
  {
    name: "Y",
    shape: [
      [1, 0],
      [2, 1],
      [1, 0],
      [1, 0],
    ],
  },
  {
    name: "Z",
    shape: [
      [1, 1, 0],
      [0, 2, 0],
      [0, 1, 1],
    ],
  },
  {
    name: "None",
    shape: [[0]],
  },
  {
    name: "R", // Terrain
    shape: [[2]],
  },
];

export const PENTOMINOES: Pentominoes = {};

pentominoPrimitives.map((p) => {
  const reflectedShape = reflectX(p.shape);
  const expandedPentomino: Pentomino = {
    name: p.name,
    shapes: {
      0: [{ center: center(p.shape), shape: p.shape }],
      1: [{ center: center(reflectedShape), shape: reflectedShape }],
    },
  };
  const orientations = expandedPentomino.shapes;
  range(0, 3).forEach(() => {
    // rotate 3 times
    range(0, 2).forEach((i) => {
      // 0 and 1
      const newShape = rotateRight(orientations[i][orientations[i].length - 1].shape);
      orientations[i].push({
        center: center(newShape),
        shape: newShape,
      });
    });
  });
  PENTOMINOES[p.name] = expandedPentomino;
});
