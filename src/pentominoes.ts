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

export const PENTOMINOES: Pentominoes = {
  None: {
    name: "",
    orientations: {
      0: [{ center: { x: 0, y: 0 }, shape: [[0]] }],
      1: [{ center: { x: 0, y: 0 }, shape: [[0]] }],
    },
  },
  Terrain: {
    name: "terrain",
    orientations: {
      0: [{ center: { x: 0, y: 0 }, shape: [[1]] }],
      1: [{ center: { x: 0, y: 0 }, shape: [[1]] }],
    },
  },
  F: {
    name: "F",
    orientations: {
      0: [
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 1],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [0, 1, 1],
            [1, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
      ],
      1: [
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 0],
            [0, 1, 1],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [1, 0, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
      ],
    },
  },
  I: {
    name: "I",
    orientations: {
      0: [
        {
          center: {
            x: 2,
            y: 0,
          },
          shape: [[1], [1], [1], [1], [1]],
        },
        { center: { x: 0, y: 2 }, shape: [[1, 1, 1, 1, 1]] },
        {
          center: {
            x: 2,
            y: 0,
          },
          shape: [[1], [1], [1], [1], [1]],
        },
        { center: { x: 0, y: 2 }, shape: [[1, 1, 1, 1, 1]] },
      ],
      1: [
        {
          center: {
            x: 2,
            y: 0,
          },
          shape: [[1], [1], [1], [1], [1]],
        },
        { center: { x: 0, y: 2 }, shape: [[1, 1, 1, 1, 1]] },
        {
          center: {
            x: 2,
            y: 0,
          },
          shape: [[1], [1], [1], [1], [1]],
        },
        { center: { x: 0, y: 2 }, shape: [[1, 1, 1, 1, 1]] },
      ],
    },
  },
  P: {
    name: "P",
    orientations: {
      0: [
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [1, 1, 0],
            [1, 1, 1],
          ],
        },
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [1, 1],
            [1, 1],
            [1, 0],
          ],
        },
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [1, 1, 1],
            [0, 1, 1],
          ],
        },
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [0, 1],
            [1, 1],
            [1, 1],
          ],
        },
      ],
      1: [
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [1, 1, 1],
            [1, 1, 0],
          ],
        },
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [1, 1],
            [1, 1],
            [0, 1],
          ],
        },
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [0, 1, 1],
            [1, 1, 1],
          ],
        },
        {
          center: {
            x: 1,
            y: 1,
          },
          shape: [
            [1, 0],
            [1, 1],
            [1, 1],
          ],
        },
      ],
    },
  },
  X: {
    name: "X",
    orientations: {
      0: [
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
      ],
      1: [
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
        {
          center: { x: 1, y: 1 },
          shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
          ],
        },
      ],
    },
  },
};
