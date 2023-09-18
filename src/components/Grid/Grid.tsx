import clsx from "clsx";
import { ReactNode, useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { PENTOMINO_DIMENSIONS } from "../../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";

export const Grid = ({ children }: { children: ReactNode }) => {
  const { pentominoSize } = useContext(AppStateContext);
  const { gridWidth, gridHeight } = useContext(GameStateContext);
  return (
    <div
      className={clsx("grid grid-flow-row w-fit", PENTOMINO_DIMENSIONS[pentominoSize])}
      style={{
        gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};
