import clsx from "clsx";
import { PENTOMINO_DIMENSIONS, PENTOMINO_SIZES } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { useContext } from "react";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";

export const Pentomino = ({ letter }: { letter: string }) => {
  const { pentominoSize } = useContext(AppStateContext);
  const { setCurrentPentomino } = useContext(GameStateContext);
  const shape = PENTOMINOES[letter].shape;
  return (
    <div
      className={clsx("grid grid-flow-row w-fit h-fit cursor-pointer pb-6", PENTOMINO_DIMENSIONS[shape[0].length])}
      onClick={() => {
        setCurrentPentomino(PENTOMINOES[letter]);
      }}
    >
      {shape.map((row, ri) =>
        row.map((cell, ci) => {
          return (
            <div
              key={`${letter}_${ri}_${ci}`}
              className={clsx(cell !== 0 ? "bg-violet-800" : "", PENTOMINO_SIZES[pentominoSize])}
            ></div>
          );
        })
      )}
    </div>
  );
};
