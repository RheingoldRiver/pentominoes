import { PaintedCell } from "../../constants";
import { Cell } from "../Cell/Cell";

export const Grid = ({
  paintedGrid,
  pentominoSize,
  borderColor = "white",
  board = false,
}: {
  paintedGrid: PaintedCell[][];
  pentominoSize: number;
  borderColor?: string;
  board?: boolean;
}) => {
  return (
    <>
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
    </>
  );
};
