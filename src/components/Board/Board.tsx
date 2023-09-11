import { range } from "lodash";
import { useContext } from "react";
import { defaultPlacedPentomino, PaintedCell } from "../../constants";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import { Cell } from "../Cell/Cell";
import { Grid } from "../Grid/Grid";

export const Board = () => {
  const { grid } = useContext(GameStateContext);
  const paintedGrid: PaintedCell[][] = range(8).map((x) =>
    range(8).map((y) => {
      return {
        pentomino: defaultPlacedPentomino(x, y),
        conflict: false,
        borderTop: false,
        borderLeft: false,
        borderBot: false,
        borderRight: false,
      };
    })
  );
  // Update the painted grid
  grid.map((r, x) =>
    r.map((p, y) => {
      if (p.pentomino === PENTOMINOES.None) return;
      const orientation = p.pentomino.orientations[p.reflection][p.rotation];
      orientation.shape.map((pr, px) =>
        pr.map((val, py) => {
          if (val === 0) return; // the pentomino isn't taking up this square of its grid, return
          const newX = x + px - orientation.center.x;
          const newY = y + py - orientation.center.y;

          // error check
          if (newX < 0 || newX > grid.length - 1) {
            const correctedX = newX < 0 ? 0 : grid.length - 1;
            if (newY < 0) {
              paintedGrid[correctedX][0].conflict = true;
            } else if (newY > grid.length - 1) {
              paintedGrid[correctedX][grid.length - 1].conflict = true;
            } else {
              paintedGrid[correctedX][newY].conflict = true;
            }
            return;
          }
          if (newY < 0) {
            paintedGrid[newX][0].conflict = true;
            return;
          }
          if (newY > grid.length - 1) {
            paintedGrid[newX][grid.length - 1].conflict = true;
            return;
          }
          // ok should be a valid placement now
          const cellToPaint = paintedGrid[newX][newY];
          if (cellToPaint.pentomino.pentomino !== PENTOMINOES.None) {
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
    <div>
      <Grid>
        {paintedGrid.map((r, x) => r.map((c, y) => <Cell key={`cell-${x}_${y}`} cell={c} x={x} y={y}></Cell>))}
      </Grid>
    </div>
  );
};