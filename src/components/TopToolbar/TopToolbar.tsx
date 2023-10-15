import { useContext } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ToolbarButton } from "../Button/Button";

const TopToolbar = ({ ...rest }) => {
  const { rotateLeft, rotateRight, reflectX, reflectY } = useContext(GameStateContext);
  return (
    <Toolbar.Root {...rest} className="space-x-3 mb-2 w-full flex justify-start" aria-label="Game controls">
      <ToolbarButton onClick={rotateLeft} aria-label="Rotate Left">
        Rotate Left
      </ToolbarButton>
      <ToolbarButton onClick={rotateRight} aria-label="Rotate Right">
        Rotate Right
      </ToolbarButton>
      <ToolbarButton onClick={reflectX} aria-label="Reflect X">
        Reflect X
      </ToolbarButton>
      <ToolbarButton onClick={reflectY} aria-label="Reflect Y">
        Reflect Y
      </ToolbarButton>
    </Toolbar.Root>
  );
};

export default TopToolbar;
