import JSONCrush from "jsoncrush";
import { range } from "lodash";
import { DEFAULT_EMPTY_GRID, EMPTY_PENTOMINO, PlacedPentomino } from "./constants";
import { PENTOMINOES } from "./pentominoes";

export type UrlConfig = {
  g: PlacedPentomino[][];
  h: number;
  w: number;
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
  h: number;
  w: number;
};

export function serializeUrl({ g: grid, h, w }: UrlConfig): string {
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
  const s = JSON.stringify({ g: placedPentominoes, h: h, w: w });
  return encodeURIComponent(JSONCrush.crush(s));
}

export function deserializeUrl(s: string): UrlConfig {
  const j: StringifiedUrlSupportedConfig = JSON.parse(JSONCrush.uncrush(decodeURIComponent(s)));
  const ret = {
    h: j.h,
    w: j.w,
    g: range(j.h).map((x) => range(j.w).map((y) => EMPTY_PENTOMINO(x, y))),
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
  h: 8,
  w: 8,
};
