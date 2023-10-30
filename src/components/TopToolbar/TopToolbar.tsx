import { useContext } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ToolbarButton } from "../Button/Button";
import { DoubleEndedArrow } from "./DoubleEndedArrow";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  OrientationActionType,
  ReflectionDirection,
  RotationDirection,
} from "../GameStateProvider/currentPentominoReducer";

const TopToolbar = ({ ...rest }) => {
  const { orientationDispatch } = useContext(GameStateContext);
  return (
    <Toolbar.Root {...rest} className="pl-2 space-x-3 mb-2 w-full flex justify-start" aria-label="Game controls">
      <ToolbarButton
        onClick={() => {
          orientationDispatch({ type: OrientationActionType.rotate, direction: RotationDirection.Left });
        }}
        aria-label="Rotate Left"
        className="flex flex-row items-center gap-1"
      >
        <div className="scale-x-[-1]">
          <ReloadIcon />
        </div>
        Rotate
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          orientationDispatch({ type: OrientationActionType.rotate, direction: RotationDirection.Right });
        }}
        aria-label="Rotate Right"
        className="flex flex-row items-center gap-1"
      >
        <ReloadIcon />
        Rotate
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          orientationDispatch({ type: OrientationActionType.reflect, direction: ReflectionDirection.X });
        }}
        aria-label="Reflect over the X-axis"
        className="flex flex-row items-center"
      >
        <div className="rotate-90">
          <DoubleEndedArrow />
        </div>
        Reflect
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          orientationDispatch({ type: OrientationActionType.reflect, direction: ReflectionDirection.Y });
        }}
        aria-label="Reflect over the Y-axis"
        className="flex flex-row items-center gap-1"
      >
        <DoubleEndedArrow />
        Reflect
      </ToolbarButton>
    </Toolbar.Root>
  );
};

export default TopToolbar;
