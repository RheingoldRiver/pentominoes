interface Coordinates {
  x: number;
  y: number;
}

interface Pentomino {
  name: string;
  center: Coordinates;
  shape: number[][];
}

interface Pentominoes {
  [key: string]: Pentomino;
}

export const PENTOMINOES: Pentominoes = {
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
