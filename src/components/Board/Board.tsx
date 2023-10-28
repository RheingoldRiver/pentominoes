import { Grid } from "../Grid/Grid";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { RefObject, forwardRef, useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import clsx from "clsx";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { OrientabilityType, SURFACES } from "../../constants";
import { ChevronDoubleUpIcon } from "@heroicons/react/20/solid";

export const Board = forwardRef(({ gridArea }: { gridArea: string }, ref) => {
  const { paintedGrid, surface } = useContext(GameStateContext);
  const { appPreferences, darkMode } = useContext(AppStateContext);
  return (
    <div
      ref={surface.name !== SURFACES.Rectangle.name ? (ref as RefObject<HTMLDivElement>) : undefined}
      className={clsx(
        "grid w-fit grid-cols-[min-content_auto_min-content] mb-2",
        "bg-slate-100 dark:bg-slate-800 rounded-lg",
        "shadow-lg shadow-slate-300 dark:shadow-none"
      )}
      style={{
        gridTemplateAreas: `"topOrientation topOrientation topOrientation" "leftOrientation grid rightOrientation" ". botOrientation ."`,
        gridArea,
      }}
    >
      <div className="flex flex-row justify-center items-center h-8" style={{ gridArea: "topOrientation" }}>
        {surface.orientability.w !== OrientabilityType.None ? <ChevronRightIcon width={20} /> : ""}
      </div>
      <div className="flex flex-col justify-center items-center w-8" style={{ gridArea: "leftOrientation" }}>
        {surface.orientability.h !== OrientabilityType.None ? <ChevronDoubleUpIcon width={20} /> : ""}
      </div>
      <div className="flex flex-col justify-center items-center w-8" style={{ gridArea: "rightOrientation" }}>
        {
          {
            [OrientabilityType.None]: "",
            [OrientabilityType.Orientable]: <ChevronDoubleUpIcon width={20} />,
            [OrientabilityType.Nonorientable]: <ChevronDoubleDownIcon width={20} />,
            [OrientabilityType.ConsecutiveNonorientable]: <ChevronDownIcon width={20} />,
            [OrientabilityType.ConsecutiveOrientable]: <ChevronUpIcon width={20} />,
          }[surface.orientability.h]
        }
      </div>
      <div className="flex flex-row justify-center items-center h-8" style={{ gridArea: "botOrientation" }}>
        {
          {
            [OrientabilityType.None]: "",
            [OrientabilityType.Orientable]: <ChevronRightIcon width={20} />,
            [OrientabilityType.Nonorientable]: <ChevronLeftIcon width={20} />,
            [OrientabilityType.ConsecutiveNonorientable]: <ChevronDoubleLeftIcon width={20} />,
            [OrientabilityType.ConsecutiveOrientable]: <ChevronDoubleRightIcon width={20} />,
          }[surface.orientability.w]
        }
      </div>
      <Grid
        paintedGrid={paintedGrid}
        gridArea="grid"
        borderColor={darkMode ? "#F3F4F6" : "white"}
        pentominoSize={appPreferences.pentominoSize}
        board={true}
        ref={ref}
      ></Grid>
    </div>
  );
});
