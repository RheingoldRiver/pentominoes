import { useContext } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../../GameStateProvider/GameStateProvider";
import clsx from "clsx";

const styles = {
  button: clsx("cursor-pointer p-2 rounded", "shadow-sm shadow-zinc-900"),
};

const GameToolbar = () => {
  const { currentRotation, setCurrentRotation, currentReflection, setCurrentReflection } = useContext(GameStateContext);
  return (
    <Toolbar.Root className="space-x-3 mb-2 w-full flex justify-start" aria-label="Game controls">
      <Toolbar.Button
        className={styles.button}
        onClick={() => {
          setCurrentRotation((4 + currentRotation - 1) % 4);
        }}
        aria-label="Rotate Left"
      >
        Rotate Left
      </Toolbar.Button>
      <Toolbar.Button
        className={styles.button}
        onClick={() => {
          setCurrentRotation((currentRotation + 1) % 4);
        }}
        aria-label="Rotate Right"
      >
        Rotate Right
      </Toolbar.Button>
      <Toolbar.Button
        className={styles.button}
        onClick={() => {
          setCurrentReflection((currentReflection + 1) % 2);
        }}
        aria-label="Reflect X"
      >
        Reflect X
      </Toolbar.Button>
      <Toolbar.Button
        className={styles.button}
        onClick={() => {
          setCurrentReflection((currentReflection + 1) % 2);
          setCurrentRotation((currentRotation + 2) % 4);
        }}
        aria-label="Reflect Y"
      >
        Reflect Y
      </Toolbar.Button>
    </Toolbar.Root>
  );
};

export default GameToolbar;
