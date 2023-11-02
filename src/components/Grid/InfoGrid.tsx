import { PlacedPentomino } from "../../constants";
import clsx from "clsx";
import { ReactNode, memo, useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";

export const InfoGrid = memo(({ grid: displayGrid, children }: { grid: PlacedPentomino[][]; children: ReactNode }) => {
  const { newGrid } = useContext(GameStateContext);
  return (
    <div
      className={clsx("grid grid-flow-row w-fit h-fit cursor-pointer")}
      style={{
        gridTemplateRows: `repeat(${displayGrid.length}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${displayGrid[0].length}, minmax(0, 1fr))`,
      }}
      onClick={() => {
        newGrid(displayGrid);
      }}
    >
      {children}
    </div>
  );
});
