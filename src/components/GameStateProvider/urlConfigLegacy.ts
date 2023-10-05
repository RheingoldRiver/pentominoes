import { StringifiedUrlConfig, StringifiedPlacedPentomino, SerializedColors } from "./urlConfig";

import { toNumber } from "lodash";
import { Surface } from "../../constants";

export function colorStartUnderscore(curToken: string, expectTwoXDigits: boolean) {
  // only used in v2 URLs
  // expected two digits if it's an uppercase letter
  // legacy urls cannot have lowercase pentomino names
  // if one digit is expected, then we're 100% guaranteed in a nonlegacy url
  if (expectTwoXDigits === false) return true;

  // in this case, we obviously see a new underscore as a new section
  if (curToken.indexOf("_") !== -1) return true;

  // if the length is 1 or 2 then it's a legacy URL; an uppercase letter requires
  // length to be 3 for it to be the start of the color section
  // and a single number taking up 3 digits is impossible because
  // max values of len, width are 99
  return curToken.length > 2;
}
export function decodeSurfacelessUrl(s: string): StringifiedUrlConfig {
  // supports v1 & v2 URLs
  let h = -1;
  let w = -1;
  const pentominoes: StringifiedPlacedPentomino[] = [];
  let curToken = "";
  let curPos = 0; // ['height', 'width', 'pentominoes', 'colors']
  let pentominoPosition = 0; // ['name', 'r', 'c']
  let curColor = -1;
  let lowercaseLetter = false;
  const colors: SerializedColors = {};
  s.split("").forEach((c) => {
    if ((c === "." || c === "_") && curPos === 0) {
      h = toNumber(curToken);
      curToken = "";
      curPos = 1;
    } else if (curPos === 3 && c.match(/[0-9]/)) {
      colors[toNumber(c)] = [];
      curColor = toNumber(c);
    } else if (curPos === 3 && c.match(/[A-Z]/)) {
      // option 1: legacy support for underscores, where we incremented _ properly
      // option 2: expecting a number & we get a letter
      colors[curColor].push(c);

      // in legacy support mode, curPos was already 3
      curPos = 3;
    } else if (
      (c === "." || c === "_") &&
      pentominoPosition === 2 &&
      colorStartUnderscore(curToken, !lowercaseLetter)
    ) {
      curPos = 3;
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
    } else if (c.match(/[A-Za-z]/)) {
      lowercaseLetter = !!c.match(/[a-z]/);
      if (curPos === 1) {
        // finish width
        w = toNumber(curToken);
        curPos += 1;
      } else {
        // finish last pentomino
        pentominoes[pentominoes.length - 1].c = curToken;
      }
      curToken = "";
      // start a new pentomino
      pentominoes.push({
        p: c,
        r: "@",
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
    pentominoes: pentominoes,
    colors: colors,
    surface: Surface.Rectangle,
  };
}
