import { range } from "lodash";
import { center, reflectX, rotateRight } from "./pentominoUtil";

export interface Coordinates {
  x: number;
  y: number;
}

interface Orientations {
  [key: number]: Shape[];
}

interface Shape {
  center: Coordinates;
  shape: number[][];
}

export interface Pentomino {
  name: string;
  orientations: Orientations;
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
];

export const PENTOMINOES: Pentominoes = {
  None: {
    name: "None",
    orientations: {
      0: [{ center: { x: 0, y: 0 }, shape: [[0]] }],
      1: [{ center: { x: 0, y: 0 }, shape: [[0]] }],
    },
  },
  Terrain: {
    name: "Terrain",
    orientations: {
      0: [{ center: { x: 0, y: 0 }, shape: [[1]] }],
      1: [{ center: { x: 0, y: 0 }, shape: [[1]] }],
    },
  },
};

pentominoPrimitives.map((p) => {
  const reflectedShape = reflectX(p.shape);
  const expandedPentomino: Pentomino = {
    name: p.name,
    orientations: {
      0: [{ center: center(p.shape), shape: p.shape }],
      1: [{ center: center(reflectedShape), shape: reflectedShape }],
    },
  };
  const orientations = expandedPentomino.orientations;
  range(0, 3).map(() => {
    // rotate 3 times
    range(0, 2).map((i) => {
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
