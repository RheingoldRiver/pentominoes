import clsx from "clsx";
import { useContext } from "react";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";

export const Header = ({ ...rest }) => {
  const { currentPentomino, currentRotation, currentReflection } = useContext(GameStateContext);
  return (
    <div {...rest} className="flex flex-col md:flex-row pb-6">
      <div
        className={clsx(
          "flex flex-wrap max-w-[calc(100vw_-_1em)] md:max-w-[calc(100vw_-_18em)] items-center gap-4 p-2"
        )}
      >
        {["Terrain", "F", "I", "L", "P", "N", "T", "U", "V", "W", "X", "Y", "Z"].map((l) => (
          <PentominoDisplay key={l} pentomino={PENTOMINOES[l]}></PentominoDisplay>
        ))}
      </div>
      <div className="ml-20 p-1 border-solid border-black rounded border w-[9em] h-[9em] flex justify-center items-center self-end">
        <PentominoDisplay
          pentomino={currentPentomino}
          rotation={currentRotation}
          reflection={currentReflection}
        ></PentominoDisplay>
      </div>
    </div>
  );
};
