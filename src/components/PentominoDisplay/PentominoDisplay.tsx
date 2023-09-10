import clsx from "clsx";
import { PENTOMINO_DIMENSIONS, PENTOMINO_SIZES } from "../../constants";
import { Pentomino } from "../../pentominoes";
import { useContext } from "react";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";

export const PentominoDisplay = ({
  pentomino,
  rotation = 0,
  reflection = 0,
}: {
  pentomino: Pentomino;
  rotation?: number;
  reflection?: number;
}) => {
  const { pentominoSize } = useContext(AppStateContext);
  const { setCurrentPentomino } = useContext(GameStateContext);
  const shape = pentomino.orientations[reflection][rotation].shape;
  return (
    <div
      className={clsx("grid grid-flow-row w-fit h-fit cursor-pointer", PENTOMINO_DIMENSIONS[shape[0].length])}
      onClick={() => {
        setCurrentPentomino(pentomino);
      }}
    >
      {shape.map((row, ri) =>
        row.map((cell, ci) => {
          return (
            <div
              key={`${pentomino.name}_${ri}_${ci}`}
              className={clsx(cell !== 0 ? "bg-violet-800" : "", PENTOMINO_SIZES[pentominoSize])}
            ></div>
          );
        })
      )}
    </div>
  );
};
