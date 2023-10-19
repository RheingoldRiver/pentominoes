import { useContext } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ToolbarButton } from "../Button/Button";
import { DoubleEndedArrow } from "./DoubleEndedArrow";
import { ReloadIcon } from "@radix-ui/react-icons";

const TopToolbar = ({ ...rest }) => {
  const { rotateLeft, rotateRight, reflectX, reflectY } = useContext(GameStateContext);
  return (
    <Toolbar.Root {...rest} className="space-x-3 mb-2 w-full flex justify-start" aria-label="Game controls">
      <ToolbarButton onClick={rotateLeft} aria-label="Rotate Left" className="flex flex-row items-center gap-1">
        <div className="scale-x-[-1]">
          <ReloadIcon />
        </div>
        Rotate Left
      </ToolbarButton>
      <ToolbarButton onClick={rotateRight} aria-label="Rotate Right" className="flex flex-row items-center gap-1">
        <ReloadIcon />
        Rotate Right
      </ToolbarButton>
      <ToolbarButton onClick={reflectX} aria-label="Reflect X" className="flex flex-row items-center">
        <div className="rotate-90">
          <DoubleEndedArrow />
        </div>
        Reflect X
      </ToolbarButton>
      <ToolbarButton onClick={reflectY} aria-label="Reflect Y" className="flex flex-row items-center">
        <DoubleEndedArrow />
        Reflect Y
      </ToolbarButton>
    </Toolbar.Root>
  );
};

export default TopToolbar;
