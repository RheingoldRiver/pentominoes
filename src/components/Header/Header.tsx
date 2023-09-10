import clsx from "clsx";
import { useContext } from "react";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import { PENTOMINOES } from "../../pentominoes";
import GameToolbar from "../GameToolbar/GameToolbar";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";

export const Header = () => {
  const { currentPentomino, currentRotation, currentReflection } = useContext(GameStateContext);
  return (
    <>
      <div className="flex flex-row pb-6">
        <div className={clsx("flex items-center gap-4 p-2")}>
          {["F", "I", "P"].map((l) => (
            <PentominoDisplay pentomino={PENTOMINOES[l]}></PentominoDisplay>
          ))}
        </div>
        <div className="ml-20 p-1 border-solid border-black rounded border min-w-[11em] flex justify-center items-center">
          <PentominoDisplay
            pentomino={currentPentomino}
            rotation={currentRotation}
            reflection={currentReflection}
          ></PentominoDisplay>
        </div>
      </div>
      <GameToolbar></GameToolbar>
    </>
  );
};
