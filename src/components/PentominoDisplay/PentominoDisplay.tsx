import clsx from "clsx";
import { Orientation, PENTOMINO_DIMENSIONS, PENTOMINO_SIZES } from "../../constants";
import { Coordinates, Pentomino, PENTOMINOES } from "../../pentominoes";
import { useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";

export const PentominoDisplay = ({
  pentomino,
  color,
  orientation = { rotation: 0, reflection: 0 },
  checkGrid = true,
  size = 5,
  showCenter = true,
  removeEdges = [],
  ...rest
}: {
  pentomino: Pentomino;
  color?: string;
  orientation?: Orientation;
  checkGrid?: boolean;
  size?: number;
  showCenter?: boolean;
  removeEdges?: Coordinates[];
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const { grid } = useContext(GameStateContext);
  const { appPreferences } = useContext(AppStateContext);
  if (color === undefined) color = appPreferences.displayColors[0];
  const p = pentomino.shapes[orientation.reflection][orientation.rotation];
  function bgColor(cell: number, coordinates: Coordinates) {
    if (pentomino.name === PENTOMINOES.R.name) return { class: "bg-gray-600", style: "" };
    let found = false;
    if (checkGrid) {
      grid.forEach((row) =>
        row.forEach((p) => {
          if (p.pentomino.name === pentomino.name) found = true;
        })
      );
    }
    let showShadow = true;
    removeEdges.forEach((c) => {
      if (c.x === coordinates.x && c.y === coordinates.y) {
        showShadow = false;
      }
    });
    if (cell !== 0) {
      const shadow = showShadow ? "shadow-[0px_0px_1px_1px] shadow-gray-30" : "";
      const showColor = found === false ? "" : "opacity-30";
      return {
        class: clsx(`${shadow} ${showColor}`),
        style: color,
      };
    }
    return { class: "", style: "" };
  }

  // Do not return any divs because these appear inside of <p> elements in the Information modal.
  return (
    <span
      {...rest}
      className={clsx("grid grid-flow-row w-fit h-fit display-block", PENTOMINO_DIMENSIONS[p.shape[0].length])}
      title={pentomino.display || pentomino.name}
    >
      {p.shape.map((row, x) =>
        row.map((cell, y) => {
          const bg = bgColor(cell, { x, y });
          return (
            <span
              key={`${pentomino.name}_${x}_${y}`}
              className={clsx(
                PENTOMINO_SIZES[size],
                bg.class,
                "text-white flex flex-row items-center justify-center display-block"
              )}
              style={{
                fontSize: "1rem",
                lineHeight: "0.5rem",
                backgroundColor: bg.style,
              }}
            >
              {x === p.center.x && y === p.center.y && showCenter && pentomino.name !== PENTOMINOES.R.name && (
                <DotFilledIcon />
              )}
            </span>
          );
        })
      )}
    </span>
  );
};
