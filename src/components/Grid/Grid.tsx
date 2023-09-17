import clsx from "clsx";
import { ReactNode, useContext } from "react";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";
import { PENTOMINO_DIMENSIONS } from "../../constants";

export const Grid = ({ children }: { children: ReactNode }) => {
  const { pentominoSize, gridWidth, gridHeight } = useContext(AppStateContext);
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
