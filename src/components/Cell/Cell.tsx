import clsx from "clsx";
import { useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { PaintedCell, PENTOMINO_SIZES } from "../../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import { PlusIcon } from "@heroicons/react/24/outline";

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
  onClick?: (x: number, y: number) => void;
}) => {
  const { displayColors } = useContext(AppStateContext);
  const { pentominoColors, currentGridCoords } = useContext(GameStateContext);
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
      className={clsx(
        onClick === undefined ? "" : "cursor-pointer",
        PENTOMINO_SIZES[pentominoSize],
        bg.class,
        "flex justify-center align-center",
        "text-black dark:text-white"
      )}
      style={{
        borderTop: borderStyle(cell.borders.borderTop),
        borderLeft: borderStyle(cell.borders.borderLeft),
        borderBottom: borderStyle(cell.borders.borderBot),
        borderRight: borderStyle(cell.borders.borderRight),
        backgroundColor: bg.style,
      }}
      onClick={() => {
        if (onClick !== undefined) onClick(x, y);
      }}
    >
      {debug && `(${x}, ${y})`}
      {currentGridCoords.x === x && currentGridCoords.y === y && (
        <PlusIcon width={15} className="stroke-gray-800 dark:stroke-gray-200 stroke-2 drop-shadow-lgIcon" />
      )}
    </div>
  );
};
