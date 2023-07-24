import clsx from "clsx";
import { useContext } from "react";
import { AppStateContext } from "../../AppStateProvider/AppStateProvider";
import { PENTOMINO_SIZES } from "../../constants";

export const Cell = ({ cellClass }: { cellClass: number }) => {
  const { pentominoSize } = useContext(AppStateContext);
  return <div className={clsx(PENTOMINO_SIZES[pentominoSize], cellClass === 1 ? "bg-violet-800" : "")}></div>;
};
