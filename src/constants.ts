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
