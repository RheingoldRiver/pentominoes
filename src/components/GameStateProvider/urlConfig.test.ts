import { expect, test } from "vitest";
import { sum } from "./urlConfig";

// test("a URL is properly decoded, no symmetry", () => {
//   const grid: PlacedPentomino[][] = range(0, 8).map((x) =>
//     range(0, 8).map((y) => {
//       return EMPTY_PENTOMINO(x, y);
//     })
//   );
//   grid[4][4].pentomino = PENTOMINOES["I"];
//   expect(deserializeUrl("8.8I04.4")).toStrictEqual({
//     h: 8,
//     w: 8,
//     g: grid,
//   });

//   expect(decodeUrl("8.8I04.4")).toStrictEqual({
//     h: 8,
//     w: 8,
//     g: [
//       {
//         p: "I",
//         r: "0",
//         c: 4.4,
//       },
//     ],
//   });
// });

test("is vitest working 1", () => {
  expect(sum(1, 2)).toBe(4);
});

test("is vitest working 2", () => {
  expect(sum(1, 2)).toBe(3);
});
