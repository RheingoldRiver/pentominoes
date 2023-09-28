import { range } from "lodash";
import { EMPTY_PENTOMINO, PaintedCell, PlacedPentomino } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { Cell } from "../Cell/Cell";
import clsx from "clsx";

export const Board = ({
  grid,
  pentominoSize,
  gridArea,
  borderColor = "white",
  clickBoard,
}: {
  grid: PlacedPentomino[][];
  pentominoSize: number;
  gridArea?: string;
  borderColor?: string;
  clickBoard?: (x: number, y: number, hasPentomino: boolean, cell: PaintedCell) => void;
}) => {
  const paintedGrid: PaintedCell[][] = range(grid.length).map((x) =>
    range(grid[0].length).map((y) => {
      return {
        pentomino: EMPTY_PENTOMINO(x, y),
        conflict: false,
        borderTop: false,
        borderLeft: false,
        borderBot: false,
        borderRight: false,
      };
    })
  );
  // Update the painted grid
  grid.forEach((r, x) =>
    r.forEach((p, y) => {
      if (p.pentomino.name === PENTOMINOES.None.name) return;
      const orientation = p.pentomino.orientations[p.reflection][p.rotation];
      orientation.shape.forEach((pr, px) =>
        pr.forEach((val, py) => {
          if (val === 0) return; // the pentomino isn't taking up this square of its grid, return
          const newX = x + px - orientation.center.x;
          const newY = y + py - orientation.center.y;

          const height = grid.length;
          const width = grid[0].length;

          // error check
          if (newX < 0 || newX > height - 1) {
            const correctedX = newX < 0 ? 0 : height - 1;
            if (newY < 0) {
              paintedGrid[correctedX][0].conflict = true;
            } else if (newY > width - 1) {
              paintedGrid[correctedX][width - 1].conflict = true;
            } else {
              paintedGrid[correctedX][newY].conflict = true;
            }
            return;
          }
          if (newY < 0) {
            paintedGrid[newX][0].conflict = true;
            return;
          }
          if (newY > width - 1) {
            paintedGrid[newX][width - 1].conflict = true;
            return;
          }
          // ok should be a valid placement now
          const cellToPaint = paintedGrid[newX][newY];
          if (cellToPaint.pentomino.pentomino.name !== PENTOMINOES.None.name) {
            cellToPaint.conflict = true;
          }
          cellToPaint.pentomino = p;
          if (px === 0 || orientation.shape[px - 1][py] === 0) cellToPaint.borderTop = true;
          if (py === 0 || orientation.shape[px][py - 1] === 0) cellToPaint.borderLeft = true;
          if (px === orientation.shape.length - 1 || orientation.shape[px + 1][py] === 0) cellToPaint.borderBot = true;
          if (py === orientation.shape[0].length - 1 || orientation.shape[px][py + 1] === 0)
            cellToPaint.borderRight = true;
        })
      );
    })
  );
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
};
