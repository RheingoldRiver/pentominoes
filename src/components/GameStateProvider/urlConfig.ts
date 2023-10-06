import { Colors, DEFAULT_COLORS, MAX_NUM_COLORS, PlacedPentomino, Surface } from "./../../constants";
import { isEmpty, range, toNumber } from "lodash";
import { EMPTY_PENTOMINO, UrlConfig } from "../../constants";
import { Coordinates, PENTOMINOES } from "../../pentominoes";
import { decodeSurfacelessUrl } from "./urlConfigLegacy";

export interface StringifiedPlacedPentomino {
  p: string;
  r: string; // rotation & reflection
  c: string; // coordinates
}

export interface StringifiedPlacedPentominoXY {
  p: string;
  r: string;
  x: number | string;
  y: number | string;
}

export interface SerializedColors {
  [key: number]: string[];
}

export interface StringifiedUrlConfig {
  h: number;
  w: number;
  pentominoes: StringifiedPlacedPentomino[];
  colors: SerializedColors;
  surface: Surface;
}

interface Orientation {
  rotation: number;
  reflection: number;
  color: number; // index of the color in an array
}

const surfaceToLetter = {
  [Surface.Rectangle]: "R",
  [Surface.Torus]: "T",
  [Surface.ProjectivePlane]: "P",
  [Surface.KleinBottle]: "K",
};

const letterToSurface = {
  R: Surface.Rectangle,
  T: Surface.Torus,
  P: Surface.ProjectivePlane,
  K: Surface.KleinBottle,
};

enum TerrainDirection {
  none,
  height,
  width,
}

interface TerrainDirections {
  [key: string]: TerrainDirection;
}

const terrainDirections: TerrainDirections = {
  Y: TerrainDirection.width,
  Z: TerrainDirection.height,
};

interface TerrainToLetter {
  [key: number]: string;
}

const directionToLetter: TerrainToLetter = {
  [TerrainDirection.width]: "Y",
  [TerrainDirection.height]: "Z",
};

const LOWERCASE_START_INDEX = 97;
const UPPERCASE_START_INDEX = 65;
export const NUM_LETTERS_IN_ALPHABET = 26;
const CHAR_GAP_SIZE = LOWERCASE_START_INDEX - NUM_LETTERS_IN_ALPHABET - UPPERCASE_START_INDEX;
const NUM_SINGLE_DIGIT_NUMBERS = 10;

export const HALF_NUM_COLORS = MAX_NUM_COLORS / 2;

const NUM_ROTATIONS = 4;
export const NUM_SPATIAL_ORIENTATIONS = 2 * NUM_ROTATIONS;

export function encodePentomino(p: string, color: number) {
  if (color < HALF_NUM_COLORS) return p;
  return p.toLowerCase();
}

export function encodeOrientation(rotation: number, reflection: number, color: number): string {
  const r = reflection === 0 ? rotation : NUM_ROTATIONS + rotation;

  if (color >= HALF_NUM_COLORS) color = color - HALF_NUM_COLORS;
  if (color === 0 || color === undefined) return r.toString();

  const n = NUM_SPATIAL_ORIENTATIONS * (color - 1) + UPPERCASE_START_INDEX + r;
  if (n < UPPERCASE_START_INDEX + NUM_LETTERS_IN_ALPHABET) return String.fromCharCode(n);

  // use a lowercase letter
  return String.fromCharCode(n + CHAR_GAP_SIZE);
}

export function encodeNumber(n: number): string {
  if (n < NUM_SINGLE_DIGIT_NUMBERS) return n.toString();
  if (n < NUM_SINGLE_DIGIT_NUMBERS + NUM_LETTERS_IN_ALPHABET) {
    return String.fromCharCode(n - NUM_SINGLE_DIGIT_NUMBERS + LOWERCASE_START_INDEX);
  }
  if (n < NUM_SINGLE_DIGIT_NUMBERS + NUM_LETTERS_IN_ALPHABET * 2) {
    return String.fromCharCode(n - NUM_SINGLE_DIGIT_NUMBERS - NUM_LETTERS_IN_ALPHABET + UPPERCASE_START_INDEX);
  }
  return "@";
}

export function encodeColor(c: number): number {
  return c % HALF_NUM_COLORS;
}

export function serializeUnusedColors(colors: Colors, grid: PlacedPentomino[][]): string {
  const pentominoesInGrid: string[] = grid.reduce((acc: string[], row) => {
    row.forEach((p) => {
      if (p.pentomino.name !== PENTOMINOES.None.name) acc.push(p.pentomino.name);
    });
    return acc;
  }, []);

  const serializedColors: SerializedColors = Object.entries(colors).reduce((acc: SerializedColors, [k, v]) => {
    if (v === 0) return acc;
    // check the pentomino isn't in the grid; if so, its color info will be encoded
    // along with its orientation
    if (pentominoesInGrid.indexOf(k) !== -1) return acc;

    const serializedColor = encodeColor(v);
    acc[serializedColor] = [...(acc[serializedColor] || []), encodePentomino(k, v)];
    return acc;
  }, {});
  return isEmpty(serializedColors)
    ? ""
    : Object.entries(serializedColors).reduce((acc, [k, v]) => {
        return `${acc}${k}${v.join("")}`;
      }, "_");
}

interface CompressedTerrain {
  [key: string]: (string | number)[];
}

function terrainDictToString(dict: CompressedTerrain, direction: TerrainDirection): string {
  const length0: string[] = [];
  const lengthGT0: string[] = [];
  Object.entries(dict).forEach(([d, arr]) => {
    if (arr.length > 1) {
      lengthGT0.push(`${encodeNumber(arr.length - 1)}${d}${arr.join("")}`);
    } else {
      length0.push(`${d}${arr.join("")}`);
    }
  });
  return `${PENTOMINOES.R.name}${directionToLetter[direction]}${lengthGT0.join("")}${
    length0.length > 0 ? "0" : ""
  }${length0.join("")}`;
}

export function serializeTerrain(placedTerrain: StringifiedPlacedPentominoXY[]) {
  if (placedTerrain.length === 0) return "";
  const widthDict: CompressedTerrain = {};
  const heightDict: CompressedTerrain = {};
  placedTerrain.forEach((t) => {
    if (widthDict[t.y] === undefined) widthDict[t.y] = [];
    if (heightDict[t.x] === undefined) heightDict[t.x] = [];
    widthDict[t.y].push(t.x);
    heightDict[t.x].push(t.y);
  });
  const widthString = terrainDictToString(widthDict, TerrainDirection.width);
  const heightString = terrainDictToString(heightDict, TerrainDirection.height);
  const regularArray = placedTerrain.map((p) => `${p.x}${p.y}`);
  const regularString = `${PENTOMINOES.R.name}${regularArray.join("")}`;
  switch (Math.min(regularString.length, widthString.length, heightString.length)) {
    case regularString.length:
      return regularString;
    case widthString.length:
      return widthString;
    case heightString.length:
      return heightString;
  }
}

export function serializeUrl({ grid, colors, surface }: UrlConfig): string {
  const placedPentominoes: StringifiedPlacedPentomino[] = [];
  const placedTerrain: StringifiedPlacedPentominoXY[] = [];
  grid.forEach((row, x) =>
    row.forEach((p, y) => {
      if (p.pentomino.name === PENTOMINOES.R.name) {
        placedTerrain.push({
          p: PENTOMINOES.R.name,
          r: "0",
          x: encodeNumber(x),
          y: encodeNumber(y),
        });
      } else if (p.pentomino.name !== PENTOMINOES.None.name)
        placedPentominoes.push({
          p: encodePentomino(p.pentomino.name, colors[p.pentomino.name]),
          r: encodeOrientation(p.rotation, p.reflection, colors[p.pentomino.name]),
          c: `${encodeNumber(x)}${encodeNumber(y)}`,
        });
    })
  );
  const sP = placedPentominoes.map((p) => `${p.p}${p.r}${p.c}`);

  const serializedColors = serializeUnusedColors(colors, grid);

  // terrain MUST be last because it has a different scheme from pentominoes
  // and we'll no when to break out of it when we get to an underscore
  return `${surfaceToLetter[surface]}${encodeNumber(grid.length)}${encodeNumber(grid[0].length)}${sP.join(
    ""
  )}${serializeTerrain(placedTerrain)}${serializedColors}`;
}

export function decodeNumber(d: string): number {
  if (d.match(/[0-9]/)) return toNumber(d);
  if (d.match(/[a-z]/)) return NUM_SINGLE_DIGIT_NUMBERS + d.charCodeAt(0) - LOWERCASE_START_INDEX;
  if (d.match(/[A-Z]/))
    return NUM_SINGLE_DIGIT_NUMBERS + NUM_LETTERS_IN_ALPHABET + d.charCodeAt(0) - UPPERCASE_START_INDEX;
  // error
  return -1;
}

export function decodeUrl(s: string): StringifiedUrlConfig {
  // V3 URLs
  const config: StringifiedUrlConfig = {
    h: -1,
    w: -1,
    pentominoes: [],
    colors: {},
    surface: Surface.Rectangle,
  };
  let curToken = "";

  // ['surface', 'height', 'width', 'pentominoes', 'terrain', 'colors']
  let curPos = 0;

  // pentominoes: ['name', 'r', 'x', 'y']
  // terrain: ['terrain direction', 'count', 'cross coordinate', 'coordinate', 'x', 'y']
  let pentominoPos = 0;
  let curColor = -1;
  let terrainCount = 0;
  let terrainDir = TerrainDirection.none;
  s.split("").forEach((c) => {
    switch (curPos) {
      case 0: {
        config.surface = letterToSurface[c as keyof typeof letterToSurface];
        curPos = 1;
        break;
      }
      case 1: {
        config.h = decodeNumber(c);
        curPos = 2;
        break;
      }
      case 2: {
        config.w = decodeNumber(c);
        curPos = 3;
        break;
      }
      case 3: {
        // pentominoes
        if (c.match("_")) {
          // terrain could not exist, so this might come here
          curPos = 5;
          break;
        }
        switch (pentominoPos) {
          case 0: {
            // name of pentomino
            if (c.match(PENTOMINOES.R.name)) {
              curPos = 4;
              break;
            }
            config.pentominoes.push({
              p: c,
              r: "@", // charCode 64
              c: "",
            });
            pentominoPos = 1;
            break;
          }
          case 1: {
            // orientation
            config.pentominoes[config.pentominoes.length - 1].r = c;
            pentominoPos = 2;
            break;
          }
          case 2: {
            curToken = decodeNumber(c).toString();
            pentominoPos = 3;
            break;
          }
          case 3: {
            // hook into the original support of decoding coordinates that split on `_`
            // this way we have the same types when decoding legacy formats & also current formats
            config.pentominoes[config.pentominoes.length - 1].c = `${curToken}_${decodeNumber(c)}`;
            pentominoPos = 0;
            break;
          }
        }
        break;
      }
      case 4: {
        // terrain
        if (c.match("_")) {
          curPos = 5;
          break;
        }
        switch (pentominoPos) {
          case 0: {
            // is it a Y or Z?
            if (terrainDirections[c] !== undefined) {
              terrainDir = terrainDirections[c];
              pentominoPos = 1;
            } else {
              curToken = decodeNumber(c).toString();
              pentominoPos = 5;
            }
            break;
          }
          case 1: {
            if (c === "0") {
              pentominoPos = 4;
              break;
            }
            terrainCount = decodeNumber(c);
            pentominoPos = 2;
            break;
          }
          case 2: {
            // cross coordinate
            curToken = c;
            pentominoPos = 3;
            break;
          }
          case 3: {
            config.pentominoes.push({
              p: PENTOMINOES.R.name,
              r: "0",
              c:
                terrainDir === TerrainDirection.height
                  ? `${decodeNumber(curToken)}_${decodeNumber(c)}`
                  : `${decodeNumber(c)}_${decodeNumber(curToken)}`,
            });
            if (terrainCount === 0) pentominoPos = 1;
            terrainCount -= 1;
            break;
          }
          case 4: {
            // x
            curToken = decodeNumber(c).toString();
            pentominoPos = 5;
            break;
          }
          case 5: {
            // y

            // hook into the original support of decoding coordinates that split on `_`
            // this way we have the same types when decoding legacy formats & also current formats
            config.pentominoes.push({
              p: PENTOMINOES.R.name,
              r: "0",
              c: `${curToken}_${decodeNumber(c)}`,
            });
            pentominoPos = 4;
            break;
          }
        }
        break;
      }
      case 5: {
        if (c.match(/[0-9a-b]/)) {
          curColor = decodeNumber(c);
        } else {
          if (config.colors[curColor] === undefined) config.colors[curColor] = [];
          config.colors[curColor].push(c);
        }
        break;
      }
    }
  });
  // console.log(config.pentominoes);
  return config;
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

export function decodeCoordinates(s: string, xHasTwoCharacters: boolean): Coordinates {
  // support for V1 & V3 URLs
  // note: in V3, the meaning of xHasTwoCharacters does not matter
  const coords = s.split(/[\\._]/);
  if (coords.length === 2) {
    return {
      x: toNumber(coords[0]),
      y: toNumber(coords[1]),
    };
  }
  // V2 URLs
  if (xHasTwoCharacters) {
    return {
      x: toNumber(s.slice(0, 2)),
      y: toNumber(s.slice(2)),
    };
  }
  return {
    x: toNumber(s.slice(0, 1)),
    y: toNumber(s.slice(1)),
  };
}

function decodeColor(color: string | number, p: string, legacy: boolean): number {
  if (legacy === true) return toNumber(color);
  if (p.toUpperCase() == p) return toNumber(color);
  return toNumber(color) + HALF_NUM_COLORS;
}

export function deserializeUrl(s: string): UrlConfig {
  const legacy = !!s[0].match(/[0-9]/);
  const config = legacy === true ? decodeSurfacelessUrl(s) : decodeUrl(s);
  // console.log(config.pentominoes);
  const ret = {
    grid: range(config.h).map((x) => range(config.w).map((y) => EMPTY_PENTOMINO(x, y))),
    // pentominoes that aren't placed
    colors: Object.entries(config.colors).reduce((acc, [k, v]) => {
      v.forEach((p: string) => {
        acc[p.toUpperCase()] = decodeColor(k, p, legacy);
      });
      return acc;
    }, DEFAULT_COLORS),
    surface: config.surface,
  };
  config.pentominoes.forEach((p) => {
    const r = decodeOrientation(p.r);
    const { x, y } = decodeCoordinates(p.c, p.p === p.p.toUpperCase());
    ret.grid[x][y] = {
      pentomino: PENTOMINOES[p.p.toUpperCase()],
      rotation: r.rotation,
      reflection: r.reflection,
      x: x,
      y: y,
    };
    if (p.p.toUpperCase() !== PENTOMINOES.R.name) ret.colors[p.p.toUpperCase()] = decodeColor(r.color, p.p, legacy);
  });
  return ret;
}
