import clsx from "clsx";
import { ReactNode, useContext } from "react";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";
import { PENTOMINO_DIMENSIONS } from "../../constants";

export const Grid = ({ children }: { children: ReactNode }) => {
  const { pentominoSize } = useContext(AppStateContext);
  return (
    <div className={clsx("grid grid-flow-row w-fit grid-cols-8 grid-rows-8", PENTOMINO_DIMENSIONS[pentominoSize])}>
      {children}
    </div>
  );
};
