import clsx from "clsx";
import { useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";
import { ALL_PENTOMINO_NAMES } from "../../constants";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";

export const Header = ({ ...rest }) => {
  const { currentPentomino, updateCurrentPentomino, currentOrientation, pentominoColors, showKeyboardIndicators } =
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
        <PentominoDisplay
          pentomino={currentPentomino}
          color={appPreferences.displayColors[pentominoColors[currentPentomino.name]]}
          orientation={currentOrientation}
        ></PentominoDisplay>
      </div>
    </div>
  );
};
