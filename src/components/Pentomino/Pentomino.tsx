import clsx from "clsx";
import { PENTOMINO_DIMENSIONS } from "../../constants";
import { Cell } from "../Cell/Cell";
import { pentominoShapes } from "./pentominoShapes";

export const Pentomino = ({ letter }: { letter: string }) => {
  const pentomino = pentominoShapes[letter];
  return (
    <div className={clsx("grid grid-flow-row w-fit", PENTOMINO_DIMENSIONS[pentomino[0].length])}>
      {pentomino.map((row, ri) => row.map((cell, ci) => <Cell key={`${letter}_${ri}_${ci}`} cellClass={cell}></Cell>))}
    </div>
  );
};
