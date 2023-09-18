import { range, toInteger } from "lodash";
import { DEFAULT_EMPTY_GRID, EMPTY_PENTOMINO, PlacedPentomino } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";

export type UrlConfig = {
  g: PlacedPentomino[][];
  h: number;
  w: number;
};

interface StringifiedPlacedPentomino {
  p: string;
  r: number; // rotation & reflection
  c: string; // coordinates
}

interface StringifiedUrlConfig {
  h: number;
  w: number;
  g: StringifiedPlacedPentomino[];
}

export function serializeUrl({ g: grid, h, w }: UrlConfig): string {
  const placedPentominoes: StringifiedPlacedPentomino[] = [];
  grid.map((row, x) =>
    row.map((p, y) => {
      if (p.pentomino !== PENTOMINOES.None)
        placedPentominoes.push({
          p: p.pentomino.name,
          r: p.reflection === 1 ? 4 + p.rotation : p.rotation,
          c: `${x}.${y}`,
        });
    })
  );
  const s = placedPentominoes.map((p) => `${p.p}${p.r}${p.c}`);
  return `${h}.${w}${s.join("")}`;
}

export function decodeUrl(s: string): StringifiedUrlConfig {
  let h = -1;
  let w = -1;
  const pentominoes: StringifiedPlacedPentomino[] = [];
  let curToken = "";
  let curPos = 0; // ['height', 'width', 'pentominoes']
  let expectRotation = false; // ['name', 'r', 'c']
  s.split("").map((c) => {
    if (c === "." && curPos === 0) {
      // console.log(curToken);
      h = toInteger(curToken);
      // console.log(h);
      curToken = "";
      curPos += 1;
    } else if (expectRotation === true) {
      pentominoes[pentominoes.length - 1].r = toInteger(c);
      expectRotation = false;
    } else if (c.match(/[\\.0-9]/)) {
      curToken = `${curToken}${c}`;
    } else if (c.match(/[A-Z]/)) {
      if (curPos === 1) {
        // finish width
        w = toInteger(curToken);
        // console.log(w);
        curPos += 1;
      } else {
        // finish last pentomino
        pentominoes[pentominoes.length - 1].c = curToken;
      }
      curToken = "";
      // start a new pentomino
      pentominoes.push({
        p: c,
        r: -1,
        c: "",
      });
      expectRotation = true;
    }
  });
  // resolve the last character
  if (pentominoes.length > 0) {
    pentominoes[pentominoes.length - 1].c = curToken;
  } else {
    w = toInteger(curToken);
  }
  return {
    h: h,
    w: w,
    g: pentominoes,
  };
}

export function deserializeUrl(s: string): UrlConfig {
  const config = decodeUrl(s);
  const ret = {
    h: config.h,
    w: config.w,
    g: range(config.h).map((x) => range(config.w).map((y) => EMPTY_PENTOMINO(x, y))),
  };
  config.g.map((p) => {
    const coords = p.c.split(".");
    const x = toInteger(coords[0]);
    const y = toInteger(coords[1]);
    ret.g[x][y] = {
      pentomino: PENTOMINOES[p.p],
      rotation: p.r % 4,
      reflection: p.r >= 4 ? 1 : 0,
      x: x,
      y: y,
    };
  });
  return ret;
}

export const DEFAULT_CONFIG = {
  g: DEFAULT_EMPTY_GRID,
  h: 8,
  w: 8,
};
