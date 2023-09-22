import clsx from "clsx";
import { PENTOMINO_DIMENSIONS, PENTOMINO_SIZES } from "../../constants";
import { Pentomino, PENTOMINOES } from "../../pentominoes";
import { useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";

export const PentominoDisplay = ({
  pentomino,
  rotation = 0,
  reflection = 0,
}: {
  pentomino: Pentomino;
  rotation?: number;
  reflection?: number;
}) => {
  const { grid, setCurrentPentomino, setCurrentRotation, setCurrentReflection, pentominoColors } =
    useContext(GameStateContext);
  const { displayColors } = useContext(AppStateContext);
  const p = pentomino.orientations[reflection][rotation];
  function bgColor(cell: number) {
    if (pentomino === PENTOMINOES.R) return { class: "bg-gray-600", style: "" };
    let found = false;
    grid.map((row) =>
      row.map((p) => {
        if (p.pentomino.name === pentomino.name) found = true;
      })
    );
    if (cell !== 0)
      return {
        class: found === false ? "" : "opacity-30",
        style: `${displayColors[pentominoColors[pentomino.name]]}`,
      };
    return { class: "", style: "" };
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
          const bg = bgColor(cell);
          return (
            <div
              key={`${pentomino.name}_${x}_${y}`}
              className={clsx(PENTOMINO_SIZES[5], bg.class, "text-white flex flex-row items-center justify-center")}
              style={{
                fontSize: "1rem",
                lineHeight: "0.5rem",
                backgroundColor: bg.style,
              }}
            >
              {x === p.center.x && y === p.center.y && <DotFilledIcon />}
            </div>
          );
        })
      )}
    </div>
  );
};
