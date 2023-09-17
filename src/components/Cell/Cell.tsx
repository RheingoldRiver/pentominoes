import clsx from "clsx";
import { useContext } from "react";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";
import { PaintedCell, PENTOMINO_SIZES } from "../../constants";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";

export const Cell = ({ cell, x = 0, y = 0 }: { cell: PaintedCell; x: number; y: number }) => {
  const { pentominoSize } = useContext(AppStateContext);
  const {
    drawPentomino,
    erasePentomino,
    setCurrentGridCoords,
    setCurrentPentomino,
    setCurrentRotation,
    setCurrentReflection,
  } = useContext(GameStateContext);
  const hasPentomino = cell.pentomino.pentomino !== PENTOMINOES.None;
  function borderStyle(b: boolean) {
    if (b === true) return "2px solid #C4B5FD";
    if (hasPentomino) return "";
    return "1px solid white";
  }
  function backgroundColor() {
    if (cell.conflict === true && hasPentomino === true) return "bg-red-700";
    if (cell.pentomino.pentomino === PENTOMINOES.Terrain) return "bg-gray-600";
    if (hasPentomino === true) return "bg-violet-800";
    return "bg-gray-200";
  }
  return (
    <div
      className={clsx("cursor-pointer", PENTOMINO_SIZES[pentominoSize], backgroundColor())}
      style={{
        borderTop: borderStyle(cell.borderTop),
        borderLeft: borderStyle(cell.borderLeft),
        borderBottom: borderStyle(cell.borderBot),
        borderRight: borderStyle(cell.borderRight),
      }}
      onClick={() => {
        setCurrentGridCoords({ x: x, y: y }); // I think I don't need this
        if (hasPentomino === false) {
          drawPentomino(x, y);
        } else {
          setCurrentPentomino(cell.pentomino.pentomino);
          erasePentomino(cell.pentomino.x, cell.pentomino.y);
          setCurrentRotation(cell.pentomino.rotation);
          setCurrentReflection(cell.pentomino.reflection);
        }
      }}
    ></div>
  );
};
