import { range } from "lodash";
import { Pentomino, PENTOMINOES } from "./pentominoes";

interface PentominoSizes {
  [key: number]: string;
}

export const PENTOMINO_SIZES: PentominoSizes = {
  4: "w-3 h-3 md:w-4 md:h-4",
  5: "w-4 h-4 md:w-5 md:h-5",
  6: "w-5 h-5 md:w-6 md:h-6",
  8: "w-6 h-6 md:w-8 md:h-8",
  10: "w-7 h-7 md:w-10 md:h-10",
  12: "w-8 h-8 md:w-12 md:h-12",
  14: "w-10 h-10 md:w-14 md:h-14",
  16: "w-12 h-12 md:w-16 md:h-16",
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

export function EMPTY_PENTOMINO(x: number, y: number) {
  return {
    pentomino: PENTOMINOES.None,
    rotation: 0,
    reflection: 0,
    x: x,
    y: y,
  };
}

export const DEFAULT_EMPTY_GRID: PlacedPentomino[][] = range(0, 8).map((x) =>
  range(0, 8).map((y) => {
    return EMPTY_PENTOMINO(x, y);
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
