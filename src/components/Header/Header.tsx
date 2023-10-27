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
        "flex flex-col md:flex-row p-4 rounded-lg mb-3",
        "bg-slate-100 dark:bg-slate-800",
        "shadow-md shadow-slate-300 dark:shadow-none"
      )}
    >
      <div
        className={clsx(
          "flex flex-wrap max-w-[calc(100vw_-_1em)] md:max-w-[calc(100vw_-_18em)] items-center gap-4 px-2"
        )}
      >
        {ALL_PENTOMINO_NAMES.map((l) => (
          <div
            key={l}
            className={clsx(
              currentPentomino.name === l && showKeyboardIndicators ? "border-b border-b-px border-b-slate-300" : "",
              "py-3 rounded-sm"
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
      </div>
      <div
        className={clsx(
          "lg:ml-6 xl:ml-16 p-1 border-solid  rounded border w-[8em] h-[8em] flex justify-center items-center self-end",
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
