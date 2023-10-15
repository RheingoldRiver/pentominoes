import { PaintedCell } from "../../constants";
import { Cell } from "../Cell/Cell";
import clsx from "clsx";
import { memo } from "react";

function GridComponent({
  paintedGrid,
  pentominoSize,
  gridArea,
  borderColor = "white",
  board = false,
}: {
  paintedGrid: PaintedCell[][];
  pentominoSize: number;
  gridArea?: string;
  borderColor?: string;
  board?: boolean;
}) {
  return (
    <div
      className={clsx("grid grid-flow-row w-fit h-fit")}
      style={{
        gridTemplateRows: `repeat(${paintedGrid.length}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${paintedGrid[0].length}, minmax(0, 1fr))`,
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
            board={board}
          ></Cell>
        ))
      )}
    </div>
  );
}

export const Grid = memo(GridComponent);
