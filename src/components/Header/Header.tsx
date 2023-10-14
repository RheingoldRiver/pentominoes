import clsx from "clsx";
import { useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";
import { PENTOMINO_NAMES } from "../../constants";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";

export const Header = ({ ...rest }) => {
  const {
    currentPentomino,
    setCurrentPentomino,
    currentRotation,
    setCurrentRotation,
    currentReflection,
    setCurrentReflection,
    pentominoColors,
  } = useContext(GameStateContext);

  const { displayColors } = useContext(AppStateContext);

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
          "flex flex-wrap max-w-[calc(100vw_-_1em)] md:max-w-[calc(100vw_-_18em)] items-center gap-4 p-2"
        )}
      >
        {["R"].concat(PENTOMINO_NAMES).map((l) => (
          <PentominoDisplay
            key={l}
            pentomino={PENTOMINOES[l]}
            color={displayColors[pentominoColors[l]]}
            onClick={() => {
              setCurrentPentomino(PENTOMINOES[l]);
              setCurrentRotation(0);
              setCurrentReflection(0);
            }}
            style={{
              cursor: "pointer",
            }}
          ></PentominoDisplay>
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
          color={displayColors[pentominoColors[currentPentomino.name]]}
          rotation={currentRotation}
          reflection={currentReflection}
        ></PentominoDisplay>
      </div>
    </div>
  );
};
