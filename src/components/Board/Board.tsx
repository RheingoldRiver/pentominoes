import { Grid } from "../Grid/Grid";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import clsx from "clsx";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Orientation, surfaceOrientations } from "../../constants";

export const Board = ({ gridArea }: { gridArea: string }) => {
  const { grid, surface, clickBoard } = useContext(GameStateContext);
  const { pentominoSize, darkMode } = useContext(AppStateContext);
  return (
    <div
      className={clsx(
        "grid w-fit grid-cols-[min-content_auto_min-content]",
        "bg-slate-100 dark:bg-slate-800 rounded-lg"
      )}
      style={{
        gridTemplateAreas: `"topOrientation topOrientation topOrientation" "leftOrientation grid rightOrientation" ". botOrientation ."`,
        gridArea,
      }}
    >
      <div className="flex flex-row justify-center items-center h-8" style={{ gridArea: "topOrientation" }}>
        {surfaceOrientations[surface].w !== Orientation.None ? <ChevronRightIcon width={20} /> : ""}
      </div>
      <div className="flex flex-col justify-center items-center w-8" style={{ gridArea: "leftOrientation" }}>
        {surfaceOrientations[surface].h !== Orientation.None ? <ChevronDoubleDownIcon width={20} /> : ""}
      </div>
      <div className="flex flex-col justify-center items-center w-8" style={{ gridArea: "rightOrientation" }}>
        {surfaceOrientations[surface].h !== Orientation.None ? (
          surfaceOrientations[surface].h === Orientation.Nonorientable ? (
            <ChevronDoubleUpIcon width={20} />
          ) : (
            <ChevronDoubleDownIcon width={20} />
          )
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-row justify-center items-center h-8" style={{ gridArea: "botOrientation" }}>
        {surfaceOrientations[surface].w !== Orientation.None ? (
          surfaceOrientations[surface].w === Orientation.Nonorientable ? (
            <ChevronLeftIcon width={20} />
          ) : (
            <ChevronRightIcon width={20} />
          )
        ) : (
          ""
        )}
      </div>
      <Grid
        grid={grid}
        gridArea="grid"
        borderColor={darkMode ? "#F3F4F6" : "white"}
        pentominoSize={pentominoSize}
        surface={surface}
        clickBoard={clickBoard}
      ></Grid>
    </div>
  );
};
