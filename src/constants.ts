import { range } from "lodash";
import { Pentomino, PENTOMINOES } from "./pentominoes";

interface PentominoSizes {
  [key: number]: string;
}

export const PENTOMINO_SIZES: PentominoSizes = {
  4: "w-4 h-4",
  5: "w-5 h-5",
  6: "w-6 h-6",
  7: "w-7 h-7",
  8: "w-8 h-8",
  9: "w-9 h-9",
  11: "w-11 h-11",
  12: "w-12 h-12",
  10: "w-10 h-10",
};

interface PentominoDimensions {
  [key: number]: string;
}

export const PENTOMINO_DIMENSIONS: PentominoDimensions = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

export interface PlacedPentomino {
  pentomino: Pentomino;
  rotation: number;
  reflection: number;
  x: number;
  y: number;
}

export function defaultPlacedPentomino(x: number, y: number) {
  return {
    pentomino: PENTOMINOES.None,
    rotation: 0,
    reflection: 0,
    x: x,
    y: y,
  };
}

export const EMPTY_GRID: PlacedPentomino[][] = range(0, 8).map((x) =>
  range(0, 8).map((y) => {
    return defaultPlacedPentomino(x, y);
  })
);

export interface PaintedCell {
  pentomino: PlacedPentomino;
  conflict: boolean;
  borderTop: boolean;
  borderLeft: boolean;
  borderBot: boolean;
  borderRight: boolean;
}
