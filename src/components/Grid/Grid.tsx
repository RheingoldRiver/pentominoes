import { PlacedPentomino, Surface } from "../../constants";
import { Cell } from "../Cell/Cell";
import clsx from "clsx";
import { memo, useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";

function GridComponent({
  pentominoSize,
  gridArea,
  borderColor = "white",
  clickBoard,
}: {
  grid: PlacedPentomino[][];
  pentominoSize: number;
  gridArea?: string;
  borderColor?: string;
  surface?: Surface;
  clickBoard?: (x: number, y: number) => void;
}) {
  const { paintedGrid } = useContext(GameStateContext);
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
            onClick={clickBoard}
          ></Cell>
        ))
      )}
    </div>
  );
}

export const Grid = memo(GridComponent);
