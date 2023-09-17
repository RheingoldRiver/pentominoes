import clsx from "clsx";
import { PENTOMINO_DIMENSIONS, PENTOMINO_SIZES } from "../../constants";
import { Pentomino, PENTOMINOES } from "../../pentominoes";
import { useContext } from "react";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";

export const PentominoDisplay = ({
  pentomino,
  rotation = 0,
  reflection = 0,
}: {
  pentomino: Pentomino;
  rotation?: number;
  reflection?: number;
}) => {
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
              className={clsx(
                bgColor(cell),
                PENTOMINO_SIZES[5],
                "text-white flex flex-row items-center justify-center"
              )}
              style={{
                fontSize: "1rem",
                lineHeight: "0.5rem",
              }}
            >
              {x === p.center.x && y === p.center.y && (
                // Source: https://www.radix-ui.com/icons
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
