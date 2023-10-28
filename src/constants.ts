import { range } from "lodash";
import { Coordinates, Pentomino, PENTOMINOES } from "./pentominoes";

interface PentominoSizes {
  [key: number]: string;
}

export const PENTOMINO_SIZES: PentominoSizes = {
  2: "w-2 h-2 md:w-3 md:h-3",
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

export interface Orientation {
  rotation: number;
  reflection: number;
}

export interface PlacedPentomino {
  pentomino: Pentomino;
  orientation: Orientation;
  coordinates: Coordinates;
}

export function EMPTY_PENTOMINO(x: number, y: number): PlacedPentomino {
  return {
    pentomino: PENTOMINOES.None,
    orientation: {
      rotation: 0,
      reflection: 0,
    },
    coordinates: { x, y },
  };
}

export interface Borders {
  borderTop: boolean;
  borderLeft: boolean;
  borderBot: boolean;
  borderRight: boolean;
}

export enum ConflictType {
  None,
  Overflow,
  Intersection,
}

interface Conflict {
  type: ConflictType;
  tileName: string;
}

export interface PaintedCell {
  pentomino: PlacedPentomino;
  conflict: Conflict;
  borders: Borders;
  center: boolean;
  hovered: boolean;
}

export const MAX_NUM_COLORS = 12;

export interface Colors {
  [key: string]: number;
}

export const PENTOMINO_NAMES = ["F", "I", "L", "P", "N", "T", "U", "V", "W", "X", "Y", "Z"];

export const ALL_PENTOMINO_NAMES = ["R", ...PENTOMINO_NAMES];

export const DEFAULT_COLORS: Colors = {};

PENTOMINO_NAMES.forEach((p) => (DEFAULT_COLORS[p] = 0));

export enum OrientabilityType {
  Orientable,
  Nonorientable,
  ConsecutiveOrientable,
  ConsecutiveNonorientable,
  None,
}

interface Orientability {
  h: OrientabilityType;
  w: OrientabilityType;
}

export interface Surface {
  name: string;
  consecutive: boolean;
  key: string;
  orientability: Orientability;
}

interface Surfaces {
  [key: string]: Surface;
}

export const SURFACES: Surfaces = {
  Rectangle: {
    name: "Rectangle",
    consecutive: false,
    key: "R",
    orientability: { w: OrientabilityType.None, h: OrientabilityType.None },
  },
  Cylinder: {
    name: "Cylinder",
    consecutive: false,
    key: "C",
    orientability: { w: OrientabilityType.None, h: OrientabilityType.Orientable },
  },
  Sphere: {
    name: "Sphere",
    consecutive: true,
    key: "S",
    orientability: { w: OrientabilityType.ConsecutiveOrientable, h: OrientabilityType.ConsecutiveOrientable },
  },
  Torus: {
    name: "Torus",
    consecutive: false,
    key: "T",
    orientability: { w: OrientabilityType.Orientable, h: OrientabilityType.Orientable },
  },
  Mobius: {
    name: "Mobius",
    consecutive: false,
    key: "M",
    orientability: { w: OrientabilityType.None, h: OrientabilityType.Nonorientable },
  },
  ProjectivePlane: {
    name: "ProjectivePlane",
    consecutive: false,
    key: "P",
    orientability: { w: OrientabilityType.Nonorientable, h: OrientabilityType.Nonorientable },
  },
  KleinBottle: {
    name: "KleinBottle",
    consecutive: false,
    key: "K",
    orientability: { w: OrientabilityType.Orientable, h: OrientabilityType.Nonorientable },
  },
};

export const letterToSurface: { [key: string]: Surface } = {};

Object.values(SURFACES).forEach((s) => (letterToSurface[s.key] = s));

export type UrlConfig = {
  grid: PlacedPentomino[][];
  colors: Colors;
  surface: Surface;
};

export function EMPTY_GRID(w: number, h: number): PlacedPentomino[][] {
  return range(0, h).map((x) =>
    range(0, w).map((y) => {
      return EMPTY_PENTOMINO(x, y);
    })
  );
}

export const DEFAULT_CONFIG: UrlConfig = {
  grid: EMPTY_GRID(8, 8),
  colors: DEFAULT_COLORS,
  surface: SURFACES.Rectangle,
};

export const DEFAULT_DISPLAY_COLORS = [
  "#6d28d9", // 0
  "#9D174D",
  "#1E40AF", // 2
  "#155E75",
  "#065F46", // 4
  "#3F6212",
  "#ca8a04",
  "#D97706",
  "#9a3412",
  "#854d0e",
  "#A21CAF",
  "#6b21a8",
];

const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export const randomPentominoColors = (numVisibleColors: number): Colors => {
  const pentominoes = [...PENTOMINO_NAMES];
  shuffleArray(pentominoes);
  return pentominoes.reduce(
    (acc: Colors, p, i) => {
      const val = i % numVisibleColors;
      acc[p] = val;
      return acc;
    },
    { ...DEFAULT_COLORS }
  );
};

interface ActionPentomino {
  prevName: string;
  prevOrientation: Orientation;
  prevCoordinates: Coordinates;
}

export interface Action {
  pentominoes: ActionPentomino[];
}

export const MAX_DIMENSION_SIZE = 60;
