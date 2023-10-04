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
  const { pentominoSize } = useContext(AppStateContext);
  return (
    <div
      className={clsx("grid w-fit grid-cols-[min-content_auto_min-content]")}
      style={{
        gridTemplateAreas: `"topOrientation topOrientation topOrientation" "leftOrientation grid rightOrientation" ". botOrientation ."`,
        gridArea,
      }}
    >
      <div className="flex flex-row justify-center h-6" style={{ gridArea: "topOrientation" }}>
        {surfaceOrientations[surface].w !== Orientation.None ? <ChevronRightIcon width={20} /> : ""}
      </div>
      <div className="flex flex-col justify-center w-6" style={{ gridArea: "leftOrientation" }}>
        {surfaceOrientations[surface].h !== Orientation.None ? <ChevronDoubleDownIcon width={20} /> : ""}
      </div>
      <div className="flex flex-col justify-center w-6" style={{ gridArea: "rightOrientation" }}>
        {surfaceOrientations[surface] ? (
          surfaceOrientations[surface].h === Orientation.Nonorientable ? (
            <ChevronDoubleUpIcon width={20} />
          ) : (
            <ChevronDoubleDownIcon width={20} />
          )
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-row justify-center h-6" style={{ gridArea: "botOrientation" }}>
        {surfaceOrientations[surface] ? (
          surfaceOrientations[surface].w === Orientation.Orientable ? (
            <ChevronLeftIcon width={20} />
          ) : (
            <ChevronRightIcon width={20} />
          )
        ) : (
          ""
        )}
      </div>
      <Grid grid={grid} gridArea="grid" pentominoSize={pentominoSize} surface={surface} clickBoard={clickBoard}></Grid>
    </div>
  );
};
