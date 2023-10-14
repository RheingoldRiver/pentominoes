import clsx from "clsx";
import { useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { PaintedCell, PENTOMINO_SIZES } from "../../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";

const debug = false;

export const Cell = ({
  cell,
  x = 0,
  y = 0,
  pentominoSize,
  borderColor,
  onClick,
}: {
  cell: PaintedCell;
  x: number;
  y: number;
  pentominoSize: number;
  borderColor: string;
  onClick?: (x: number, y: number, hasPentomino: boolean, cell: PaintedCell) => void;
}) => {
  const { displayColors } = useContext(AppStateContext);
  const { pentominoColors } = useContext(GameStateContext);
  const hasPentomino = cell.pentomino.pentomino !== PENTOMINOES.None;
  function borderStyle(b: boolean) {
    if (b === true) return "2px solid #C4B5FD";
    if (hasPentomino) return "";
    return `1px solid ${borderColor}`;
  }
  function backgroundColor() {
    if (cell.conflict === true && hasPentomino === true) return { class: "bg-red-700", style: "" };
    if (cell.pentomino.pentomino.name === PENTOMINOES.R.name)
      return { class: "bg-gray-500 dark:bg-gray-600", style: "" };
    if (hasPentomino === true)
      return { class: "", style: displayColors[pentominoColors[cell.pentomino.pentomino.name]] };
    return { class: "bg-gray-300 dark:bg-gray-800", style: "" };
  }
  const bg = backgroundColor();
  return (
    <div
      className={clsx(onClick === undefined ? "" : "cursor-pointer", PENTOMINO_SIZES[pentominoSize], bg.class)}
      style={{
        borderTop: borderStyle(cell.borders.borderTop),
        borderLeft: borderStyle(cell.borders.borderLeft),
        borderBottom: borderStyle(cell.borders.borderBot),
        borderRight: borderStyle(cell.borders.borderRight),
        backgroundColor: bg.style,
      }}
      onClick={() => {
        if (onClick !== undefined) onClick(x, y, hasPentomino, cell);
      }}
    >
      {debug && `(${x}, ${y})`}
    </div>
  );
};
