import { DEFAULT_COLORS } from "./../../constants";
import { range, toNumber } from "lodash";
import { EMPTY_PENTOMINO, UrlConfig } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";

interface StringifiedPlacedPentomino {
  p: string;
  r: string; // rotation & reflection
  c: string; // coordinates
}

interface SerializedColors {
  [key: number]: string[];
}

interface StringifiedUrlConfig {
  h: number;
  w: number;
  grid: StringifiedPlacedPentomino[];
  colors: SerializedColors;
}

interface Orientation {
  rotation: number;
  reflection: number;
  color: number; // index of the color in an array
}

const LOWERCASE_START_INDEX = 97;
const UPPERCASE_START_INDEX = 65;
export const LETTERS_IN_ALPHABET = 26;
const CHAR_GAP_SIZE = LOWERCASE_START_INDEX - LETTERS_IN_ALPHABET - UPPERCASE_START_INDEX;

const NUM_ROTATIONS = 4;
export const NUM_SPATIAL_ORIENTATIONS = 2 * NUM_ROTATIONS;

export function encodeOrientation(rotation: number, reflection: number, color: number): string {
  const r = reflection === 0 ? rotation : NUM_ROTATIONS + rotation;
  if (color === 0 || color === undefined) return r.toString();

  const n = NUM_SPATIAL_ORIENTATIONS * (color - 1) + UPPERCASE_START_INDEX + r;
  if (n < UPPERCASE_START_INDEX + LETTERS_IN_ALPHABET) return String.fromCharCode(n);

  // use a lowercase letter
  return String.fromCharCode(n + CHAR_GAP_SIZE);
}

export function serializeUrl({ grid, colors }: UrlConfig): string {
  const placedPentominoes: StringifiedPlacedPentomino[] = [];
  grid.map((row, x) =>
    row.map((p, y) => {
      if (p.pentomino !== PENTOMINOES.None)
        placedPentominoes.push({
          p: p.pentomino.name,
          r: encodeOrientation(p.rotation, p.reflection, colors[p.pentomino.name]),
          c: `${x}_${y}`,
        });
    })
  );
  const sP = placedPentominoes.map((p) => `${p.p}${p.r}${p.c}`);

  const serializedColors: SerializedColors = Object.entries(colors).reduce((acc: SerializedColors, [k, v]) => {
    if (v === 0) return acc;
    acc[v] = [...(acc[v] || []), k];
    return acc;
  }, {});
  const sC = Object.entries(serializedColors).reduce((acc, [k, v]) => {
    return `${acc}${k}${v.join("")}`;
  }, "");

  return `${grid.length}_${grid[0].length}${sP.join("")}${sC === "" ? "" : "_"}${sC}`;
}

export function decodeUrl(s: string): StringifiedUrlConfig {
  let h = -1;
  let w = -1;
  const pentominoes: StringifiedPlacedPentomino[] = [];
  let curToken = "";
  let curPos = 0; // ['height', 'width', 'pentominoes', 'colors']
  let pentominoPosition = 0; // ['name', 'r', 'c']
  let curColor = -1;
  const colors: SerializedColors = {};
  s.split("").map((c) => {
    if ((c === "." || c === "_") && curPos === 0) {
      h = toNumber(curToken);
      curToken = "";
      curPos += 1;
    } else if (curPos === 3 && c.match(/[0-9]/)) {
      colors[toNumber(c)] = [];
      curColor = toNumber(c);
    } else if (curPos === 3 && c.match(/[A-Z]/)) {
      colors[curColor].push(c);
    } else if ((c === "." || c === "_") && pentominoPosition === 2) {
      curToken = `${curToken}${c}`;
      pentominoPosition = 3;
    } else if (c === "." || c === "_") {
      // IMPORTANT: we are assuming that from now on, curToken is not updated again
      // otherwise, we need to commit the last pentomino or the width NOW
      // switch to colors, possibly skipping position 2 (if no pentominoes are placed)
      curPos = 3;
    } else if (pentominoPosition === 1) {
      pentominoes[pentominoes.length - 1].r = c;
      pentominoPosition = 2;
    } else if (c.match(/[0-9]/)) {
      curToken = `${curToken}${c}`;
    } else if (c.match(/[A-Z]/)) {
      if (curPos === 1) {
        // finish width
        w = toNumber(curToken);
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
        r: "@", // charCode 64
        c: "",
      });
      pentominoPosition = 1;
    }
  });

  if (pentominoes.length > 0) {
    pentominoes[pentominoes.length - 1].c = curToken;
  } else {
    w = toNumber(curToken);
  }

  return {
    h: h,
    w: w,
    grid: pentominoes,
    colors: colors,
  };
}

export function decodeOrientation(r: string): Orientation {
  const asNumber = toNumber(r);
  if (!isNaN(asNumber)) {
    return {
      rotation: asNumber % NUM_ROTATIONS,
      reflection: asNumber >= NUM_ROTATIONS ? 1 : 0,
      color: 0,
    };
  } else {
    const charCode = r.charCodeAt(0);
    const charValue =
      charCode >= LOWERCASE_START_INDEX
        ? charCode - CHAR_GAP_SIZE - UPPERCASE_START_INDEX
        : charCode - UPPERCASE_START_INDEX;
    const o = charValue % NUM_SPATIAL_ORIENTATIONS;
    return {
      rotation: o % 4,
      reflection: o >= 4 ? 1 : 0,
      // color 0 is a digit not a letter so add 1
      color: Math.floor(charValue / NUM_SPATIAL_ORIENTATIONS) + 1,
    };
  }
}

export function deserializeUrl(s: string): UrlConfig {
  const config = decodeUrl(s);
  const ret = {
    grid: range(config.h).map((x) => range(config.w).map((y) => EMPTY_PENTOMINO(x, y))),
    // pentominoes that aren't placed
    colors: Object.entries(config.colors).reduce((acc, [k, v]) => {
      v.map((p: string) => {
        acc[p] = toNumber(k);
      });
      return acc;
    }, DEFAULT_COLORS),
  };
  config.grid.map((p) => {
    const r = decodeOrientation(p.r);
    const coords = p.c.split(/[\\._]/);
    const x = toNumber(coords[0]);
    const y = toNumber(coords[1]);
    ret.grid[x][y] = {
      pentomino: PENTOMINOES[p.p],
      rotation: r.rotation,
      reflection: r.reflection,
      x: x,
      y: y,
    };
    ret.colors[p.p] = r.color;
  });
  return ret;
}
