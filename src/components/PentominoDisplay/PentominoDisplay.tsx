import clsx from "clsx";
import { PENTOMINO_DIMENSIONS, PENTOMINO_SIZES } from "../../constants";
import { Pentomino, PENTOMINOES } from "../../pentominoes";
import { MouseEvent, useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";

export const PentominoDisplay = ({
  pentomino,
  color,
  rotation = 0,
  reflection = 0,
  onClick,
  checkGrid = true,
  size = 5,
}: {
  pentomino: Pentomino;
  color?: string;
  rotation?: number;
  reflection?: number;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  checkGrid?: boolean;
  size?: number;
}) => {
  const { grid } = useContext(GameStateContext);
  const { displayColors } = useContext(AppStateContext);
  if (color === undefined) color = displayColors[0];
  const p = pentomino.orientations[reflection][rotation];
  function bgColor(cell: number) {
    if (pentomino === PENTOMINOES.R) return { class: "bg-gray-600", style: "" };
    let found = false;
    if (checkGrid) {
      grid.forEach((row) =>
        row.forEach((p) => {
          if (p.pentomino.name === pentomino.name) found = true;
        })
      );
    }
    if (cell !== 0)
      return {
        class: found === false ? "" : "opacity-30",
        style: color,
      };
    return { class: "", style: "" };
  }

  return (
    <div
      className={clsx(
        "grid grid-flow-row w-fit h-fit",
        PENTOMINO_DIMENSIONS[p.shape[0].length],
        onClick === undefined ? "" : "cursor-pointer"
      )}
      onClick={onClick}
    >
      {p.shape.map((row, x) =>
        row.map((cell, y) => {
          const bg = bgColor(cell);
          return (
            <div
              key={`${pentomino.name}_${x}_${y}`}
              className={clsx(PENTOMINO_SIZES[size], bg.class, "text-white flex flex-row items-center justify-center")}
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
