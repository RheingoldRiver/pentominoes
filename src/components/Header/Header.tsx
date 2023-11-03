import clsx from "clsx";
import { useContext, useRef } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";
import { ALL_PENTOMINO_NAMES } from "../../constants";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import {
  OrientationActionType,
  ReflectionDirection,
  RotationDirection,
} from "../GameStateProvider/currentPentominoReducer";
import { useLongPress } from "use-long-press";

export const Header = ({ ...rest }) => {
  const { currentPentomino, updateCurrentPentomino, pentominoColors, showKeyboardIndicators } =
    useContext(GameStateContext);

  const { appPreferences } = useContext(AppStateContext);

  return (
    <div
      {...rest}
      className={clsx(
        "py-4 px-6 rounded-lg mb-3 mx-2",
        "bg-slate-100 dark:bg-slate-800",
        "shadow-md shadow-slate-300 dark:shadow-none",
        "flex flex-wrap items-center gap-4",
        "w-full max-w-[calc(100vw_-_1rem)] xl:max-w-[calc(100vw_-_18em)]"
      )}
    >
      {ALL_PENTOMINO_NAMES.map((l) => (
        <div
          key={l}
          className={clsx(
            currentPentomino.name === l && showKeyboardIndicators ? "border-b border-b-px border-b-slate-300" : "",
            "rounded-sm"
          )}
        >
          <PentominoDisplay
            pentomino={PENTOMINOES[l]}
            color={appPreferences.displayColors[pentominoColors[l]]}
            onClick={() => {
              updateCurrentPentomino(PENTOMINOES[l]);
            }}
            style={{
              cursor: "pointer",
            }}
          ></PentominoDisplay>
        </div>
      ))}
      <div
        className={clsx(
          "lg:ml-6 ml-auto p-1 border-solid rounded border w-28 h-28 md:w-32 md:h-32 flex justify-center items-center",
          "border-black dark:border-slate-50"
        )}
      >
        <CurrentPentominoDisplay />
      </div>
    </div>
  );
};

const CurrentPentominoDisplay = () => {
  const { currentPentomino, currentOrientation, orientationDispatch, pentominoColors } = useContext(GameStateContext);

  // ensure that the normal onclick doesn't trigger when releasing the long-press hook
  // by monitoring status of the mouse button
  // 1. set to false on mouse down (don't know what to handle yet)
  // 2. if mouse up before it's changed, fire normal event
  // 3. set to true when long-press happens
  // 4. if mouse up after this, do nothing
  // 5. will be set back to false on next mouse-down event
  const longPressTriggered = useRef(false);

  const { appPreferences } = useContext(AppStateContext);
  const bind = useLongPress((e) => {
    e.preventDefault();
    e.stopPropagation();
    orientationDispatch({
      type: OrientationActionType.reflect,
      direction: ReflectionDirection.Y,
    });
    longPressTriggered.current = true;
  });

  return (
    <button
      className="cursor-pointer"
      onMouseDown={() => (longPressTriggered.current = false)}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (longPressTriggered.current === true) return;
        orientationDispatch({
          type: OrientationActionType.rotate,
          direction: RotationDirection.Right,
        });
      }}
      onContextMenu={(e) => e.preventDefault()}
      {...bind()}
    >
      <PentominoDisplay
        pentomino={currentPentomino}
        color={appPreferences.displayColors[pentominoColors[currentPentomino.name]]}
        orientation={currentOrientation}
      ></PentominoDisplay>
    </button>
  );
};
