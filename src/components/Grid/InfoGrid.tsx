import { PlacedPentomino } from "../../constants";
import clsx from "clsx";
import { ReactNode, memo, useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";

export const InfoGrid = memo(({ grid, children }: { grid: PlacedPentomino[][]; children: ReactNode }) => {
  const { setGrid } = useContext(GameStateContext);
  return (
    <div
      className={clsx("grid grid-flow-row w-fit h-fit cursor-pointer")}
      style={{
        gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
      onClick={() => {
        let gridIsEmpty = true;
        grid.forEach((row) =>
          row.forEach((cell) => {
            if (cell.pentomino.name !== PENTOMINOES.None.name) gridIsEmpty = false;
          })
        );
        if (gridIsEmpty || confirm("Reset your board? You won't be able to undo.")) setGrid(grid);
      }}
    >
      {children}
    </div>
  );
});
