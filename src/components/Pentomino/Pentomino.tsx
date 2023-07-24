import clsx from "clsx";
import { PENTOMINO_DIMENSIONS } from "../../constants";
import { Cell } from "../Cell/Cell";
import { PENTOMINOES } from "../../pentominoes";

export const Pentomino = ({ letter }: { letter: string }) => {
  const shape = PENTOMINOES[letter].shape;
  return (
    <div className={clsx("grid grid-flow-row w-fit", PENTOMINO_DIMENSIONS[shape[0].length])}>
      {shape.map((row, ri) => row.map((cell, ci) => <Cell key={`${letter}_${ri}_${ci}`} cellClass={cell}></Cell>))}
    </div>
  );
};
