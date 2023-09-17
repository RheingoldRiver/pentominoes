import JSONCrush from "jsoncrush";
import { range } from "lodash";
import { DEFAULT_EMPTY_GRID, EMPTY_PENTOMINO, PlacedPentomino } from "./constants";
import { PENTOMINOES } from "./pentominoes";

export type UrlConfig = {
  g: PlacedPentomino[][];
  x: number;
  y: number;
};

interface StringifiedPlacedPentomino {
  p: string;
  o: number; // rotation
  e: number; // reflection
  x: number;
  y: number;
}

type StringifiedUrlSupportedConfig = {
  g: StringifiedPlacedPentomino[];
  x: number;
  y: number;
};

export function serializeUrl({ g: grid, x, y }: UrlConfig): string {
  const placedPentominoes: StringifiedPlacedPentomino[] = [];
  grid.map((row, x) =>
    row.map((p, y) => {
      if (p.pentomino !== PENTOMINOES.None)
        placedPentominoes.push({
          p: p.pentomino.name,
          o: p.rotation,
          e: p.reflection,
          x: x,
          y: y,
        });
    })
  );
  const s = JSON.stringify({ g: placedPentominoes, x: x, y: y });
  return encodeURIComponent(JSONCrush.crush(s));
}

export function deserializeUrl(s: string): UrlConfig {
  const j: StringifiedUrlSupportedConfig = JSON.parse(JSONCrush.uncrush(decodeURIComponent(s)));
  const ret = {
    x: j.x,
    y: j.y,
    g: range(0, j.y).map((y) => range(j.x).map((x) => EMPTY_PENTOMINO(x, y))),
  };
  j.g.map((p) => {
    ret.g[p.x][p.y] = {
      pentomino: PENTOMINOES[p.p],
      rotation: p.o,
      reflection: p.e,
      x: p.x,
      y: p.y,
    };
  });
  return ret;
}

export const DEFAULT_CONFIG = {
  g: DEFAULT_EMPTY_GRID,
  x: 8,
  y: 8,
};
