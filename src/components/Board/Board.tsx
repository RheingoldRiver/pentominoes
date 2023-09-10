import { range } from "lodash";
import { useContext } from "react";
import { PaintedCell } from "../../constants";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import { Cell } from "../Cell/Cell";
import { Grid } from "../Grid/Grid";

export const Board = () => {
  const { grid } = useContext(GameStateContext);
  const paintedGrid: PaintedCell[][] = range(8).map(() =>
    range(8).map(() => {
      return {
        pentomino: PENTOMINOES.None,
        conflict: false,
        borderTop: false,
        borderLeft: false,
        borderBot: false,
        borderRight: false,
      };
    })
  );
  // Check the grid to see if anything overlaps here
  grid.map((r, x) =>
    r.map((p, y) => {
      if (p.pentomino === PENTOMINOES.None) return;
      p.pentomino.shape.map((pr, px) =>
        pr.map((val, py) => {
          if (val === 0) return; // the pentomino isn't here
          const cellToPaint = paintedGrid[x + px - p.pentomino.center.x][y + py - p.pentomino.center.y];
          if (cellToPaint.pentomino !== PENTOMINOES.None) {
            cellToPaint.conflict = true;
          }
          cellToPaint.pentomino = p.pentomino;
          if (px === 0 || p.pentomino.shape[px - 1][py] === 0) cellToPaint.borderTop = true;
          if (py === 0 || p.pentomino.shape[px][py - 1] === 0) cellToPaint.borderLeft = true;
          if (px === p.pentomino.shape.length - 1 || p.pentomino.shape[px + 1][py] === 0) cellToPaint.borderBot = true;
          if (py === p.pentomino.shape[0].length - 1 || p.pentomino.shape[px][py + 1] === 0)
            cellToPaint.borderRight = true;
        })
      );
    })
  );
  return (
    <div>
      <Grid>
        {paintedGrid.map((r, x) => r.map((c, y) => <Cell key={`cell-${x}_${y}`} cell={c} x={x} y={y}></Cell>))}
      </Grid>
    </div>
  );
};
