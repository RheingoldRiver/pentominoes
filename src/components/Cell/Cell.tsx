import clsx from "clsx";
import { useContext } from "react";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";
import { PENTOMINO_DIMENSIONS } from "../../constants";

export const Cell = ({ cellClass }: { cellClass: number }) => {
  const { pentominoSize } = useContext(AppStateContext);
  return <div className={clsx(PENTOMINO_DIMENSIONS[pentominoSize], cellClass === 1 ? "bg-violet-800" : "")}></div>;
};
