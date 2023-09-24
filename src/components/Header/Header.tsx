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
    <div {...rest} className="flex flex-col md:flex-row pb-6">
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
          ></PentominoDisplay>
        ))}
      </div>
      <div className="ml-20 p-1 border-solid border-black rounded border w-[9em] h-[9em] flex justify-center items-center self-end">
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
