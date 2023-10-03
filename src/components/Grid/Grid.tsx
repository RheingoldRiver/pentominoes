import { PaintedCell, PlacedPentomino, Surface } from "../../constants";
import { Cell } from "../Cell/Cell";
import clsx from "clsx";
import { memo } from "react";
import { getPaintedBoard } from "./paintGrid";

function GridComponent({
  grid,
  pentominoSize,
  gridArea,
  borderColor = "white",
  surface = Surface.Rectangle,
  clickBoard,
}: {
  grid: PlacedPentomino[][];
  pentominoSize: number;
  gridArea?: string;
  borderColor?: string;
  surface?: Surface;
  clickBoard?: (x: number, y: number, hasPentomino: boolean, cell: PaintedCell) => void;
}) {
  const paintedGrid = getPaintedBoard(grid, surface);
  return (
    <div
      className={clsx("grid grid-flow-row w-fit h-fit")}
      style={{
        gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
        gridArea,
      }}
    >
      {paintedGrid.map((r, x) =>
        r.map((c, y) => (
          <Cell
            key={`cell-${x}_${y}`}
            cell={c}
            x={x}
            y={y}
            pentominoSize={pentominoSize}
            borderColor={borderColor}
            onClick={clickBoard}
          ></Cell>
        ))
      )}
    </div>
  );
}

export const Grid = memo(GridComponent);
