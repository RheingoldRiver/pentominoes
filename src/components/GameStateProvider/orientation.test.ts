import { expect, test } from "vitest";
import { decodeOrientation, encodeOrientation } from "./urlConfig";

test("encode an orientation with color 0", () => {
  expect(encodeOrientation(0, 0, 0)).toBe("0");
  expect(encodeOrientation(1, 0, 0)).toBe("1");
  expect(encodeOrientation(1, 1, 0)).toBe("5");
});

test("encode an orientation in uppercase range", () => {
  expect(encodeOrientation(0, 0, 1)).toBe("A");
  expect(encodeOrientation(1, 0, 1)).toBe("B");
  expect(encodeOrientation(0, 0, 2)).toBe("I");

  expect(encodeOrientation(0, 0, 4)).toBe("Y");
  expect(encodeOrientation(1, 0, 4)).toBe("Z");
});

test("encode an orientation in lowercase range", () => {
  expect(encodeOrientation(2, 0, 4)).toBe("a");
});

test("decode an orientation with numerical color", () => {
  expect(decodeOrientation("0")).toStrictEqual({
    rotation: 0,
    reflection: 0,
    color: 0,
  });
  expect(decodeOrientation("5")).toStrictEqual({
    rotation: 1,
    reflection: 1,
    color: 0,
  });
  expect(decodeOrientation("1")).toStrictEqual({
    rotation: 1,
    reflection: 0,
    color: 0,
  });
});

test("decode an orientation with uppercase color", () => {
  expect(decodeOrientation("A")).toStrictEqual({
    rotation: 0,
    reflection: 0,
    color: 1,
  });
  expect(decodeOrientation("B")).toStrictEqual({
    rotation: 1,
    reflection: 0,
    color: 1,
  });
  expect(decodeOrientation("I")).toStrictEqual({
    rotation: 0,
    reflection: 0,
    color: 2,
  });
});

test("decode an orientation with lowercase color", () => {
  expect(decodeOrientation("a")).toStrictEqual({
    rotation: 2,
    reflection: 0,
    color: 4,
  });
});
