import clsx from "clsx";
import { PENTOMINO_DIMENSIONS, PENTOMINO_SIZES } from "../../constants";
import { Pentomino, PENTOMINOES } from "../../pentominoes";
import { useContext } from "react";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";

export const PentominoDisplay = ({
  pentomino,
  rotation = 0,
  reflection = 0,
}: {
  pentomino: Pentomino;
  rotation?: number;
  reflection?: number;
}) => {
  const { pentominoSize } = useContext(AppStateContext);
  const { grid, setCurrentPentomino, setCurrentRotation, setCurrentReflection } = useContext(GameStateContext);
  const p = pentomino.orientations[reflection][rotation];
  function bgColor(cell: number) {
    if (pentomino === PENTOMINOES.Terrain) return "bg-gray-600";
    let found = false;
    grid.map((row) =>
      row.map((p) => {
        if (p.pentomino.name === pentomino.name) found = true;
      })
    );
    if (cell !== 0) return found === false ? "bg-violet-800" : "bg-violet-300";
    return "";
  }
  return (
    <div
      className={clsx("grid grid-flow-row w-fit h-fit cursor-pointer", PENTOMINO_DIMENSIONS[p.shape[0].length])}
      onClick={() => {
        setCurrentPentomino(pentomino);
        setCurrentRotation(0);
        setCurrentReflection(0);
      }}
    >
      {p.shape.map((row, x) =>
        row.map((cell, y) => {
          return (
            <div
              key={`${pentomino.name}_${x}_${y}`}
              className={clsx(bgColor(cell), PENTOMINO_SIZES[pentominoSize], "text-white")}
            >
              {x === p.center.x && y === p.center.y && "⋅"}
            </div>
          );
        })
      )}
    </div>
  );
};
