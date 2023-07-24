interface PentominoShapes {
  [key: string]: number[][];
}

export const pentominoShapes: PentominoShapes = {
  F: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, 0],
  ],
  I: [[1], [1], [1], [1], [1]],
  P: [
    [1, 1, 0],
    [1, 1, 1],
  ],
};
