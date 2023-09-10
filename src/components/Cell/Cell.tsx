import clsx from "clsx";
import { useContext } from "react";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";
import { PaintedCell, PENTOMINO_SIZES } from "../../constants";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";

export const Cell = ({ cell, x = 0, y = 0 }: { cell: PaintedCell; x: number; y: number }) => {
  const { pentominoSize } = useContext(AppStateContext);
  const { drawPentomino, setCurrentGridCoords } = useContext(GameStateContext);
  const hasPentomino = cell.pentomino !== PENTOMINOES.None;
  function borderStyle(b) {
    if (b === true) return "2px solid red";
    if (hasPentomino) return "";
    return "1px solid white";
  }
  return (
    <div
      className={clsx(
        "cursor-pointer",
        PENTOMINO_SIZES[pentominoSize],
        cell.conflict ? "bg-red-700" : hasPentomino ? "bg-violet-800" : "bg-gray-200"
      )}
      style={{
        borderTop: borderStyle(cell.borderTop),
        borderLeft: borderStyle(cell.borderLeft),
        borderBottom: borderStyle(cell.borderBot),
        borderRight: borderStyle(cell.borderRight),
      }}
      onClick={() => {
        setCurrentGridCoords(x, y); // I think I don't need this
        drawPentomino(x, y);
      }}
    ></div>
  );
};
