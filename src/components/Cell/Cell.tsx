import clsx from "clsx";
import { useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { PaintedCell, PENTOMINO_SIZES } from "../../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";

export const Cell = ({ cell, x = 0, y = 0 }: { cell: PaintedCell; x: number; y: number }) => {
  const { pentominoSize, displayColors } = useContext(AppStateContext);
  const { pentominoColors } = useContext(GameStateContext);
  const { clickBoard } = useContext(GameStateContext);
  const hasPentomino = cell.pentomino.pentomino !== PENTOMINOES.None;
  function borderStyle(b: boolean) {
    if (b === true) return "2px solid #C4B5FD";
    if (hasPentomino) return "";
    return "1px solid white";
  }
  function backgroundColor() {
    if (cell.conflict === true && hasPentomino === true) return { class: "bg-red-700", style: "" };
    if (cell.pentomino.pentomino === PENTOMINOES.R) return { class: "bg-gray-600", style: "" };
    if (hasPentomino === true)
      return { class: "", style: displayColors[pentominoColors[cell.pentomino.pentomino.name]] };
    return { class: "bg-gray-200", style: "" };
  }
  const bg = backgroundColor();
  return (
    <div
      className={clsx("cursor-pointer", PENTOMINO_SIZES[pentominoSize], bg.class)}
      style={{
        borderTop: borderStyle(cell.borderTop),
        borderLeft: borderStyle(cell.borderLeft),
        borderBottom: borderStyle(cell.borderBot),
        borderRight: borderStyle(cell.borderRight),
        backgroundColor: bg.style,
      }}
      onClick={() => clickBoard(x, y, hasPentomino, cell)}
    ></div>
  );
};
