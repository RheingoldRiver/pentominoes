import { PaintedCell, SURFACES } from "../../constants";
import clsx from "clsx";
import { ReactNode, RefObject, forwardRef, memo, useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";

export const BoardGrid = memo(
  forwardRef(
    (
      {
        paintedGrid,
        gridArea,
        children,
      }: {
        paintedGrid: PaintedCell[][];
        gridArea: string;
        children: ReactNode;
      },
      ref
    ) => {
      const { surface } = useContext(GameStateContext);
      return (
        <div
          className={clsx("grid grid-flow-row w-fit h-fit")}
          style={{
            gridTemplateRows: `repeat(${paintedGrid.length}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${paintedGrid[0].length}, minmax(0, 1fr))`,
            gridArea,
          }}
          ref={surface.name === SURFACES.Rectangle.name ? (ref as RefObject<HTMLDivElement>) : undefined}
        >
          {children}
        </div>
      );
    }
  )
);
