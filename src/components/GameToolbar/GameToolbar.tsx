import { useContext } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ToolbarButton } from "../Button/Button";

const GameToolbar = ({ ...rest }) => {
  const { currentRotation, setCurrentRotation, currentReflection, setCurrentReflection } = useContext(GameStateContext);
  return (
    <Toolbar.Root {...rest} className="space-x-3 mb-2 w-full flex justify-start" aria-label="Game controls">
      <ToolbarButton
        onClick={() => {
          setCurrentRotation((4 + currentRotation - 1) % 4);
        }}
        aria-label="Rotate Left"
      >
        Rotate Left
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          setCurrentRotation((currentRotation + 1) % 4);
        }}
        aria-label="Rotate Right"
      >
        Rotate Right
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          if (currentRotation % 2 === 1) {
            setCurrentRotation((currentRotation + 2) % 4);
          }
          setCurrentReflection((currentReflection + 1) % 2);
        }}
        aria-label="Reflect X"
      >
        Reflect X
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          if (currentRotation % 2 === 0) {
            setCurrentRotation((currentRotation + 2) % 4);
          }
          setCurrentReflection((currentReflection + 1) % 2);
        }}
        aria-label="Reflect Y"
      >
        Reflect Y
      </ToolbarButton>
    </Toolbar.Root>
  );
};

export default GameToolbar;
