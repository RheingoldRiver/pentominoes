import { useContext } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ToolbarButton } from "../Button/Button";

const BottomToolbar = ({ ...rest }) => {
  const { clearGrid } = useContext(GameStateContext);
  return (
    <Toolbar.Root {...rest} className="space-x-3 my-2 w-full flex justify-start" aria-label="Game controls">
      <ToolbarButton
        onClick={() => {
          clearGrid(false);
        }}
        aria-label="Clear All"
      >
        Clear All
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          clearGrid(true);
        }}
        aria-label="Clear Solve"
      >
        Clear Solve
      </ToolbarButton>
    </Toolbar.Root>
  );
};

export default BottomToolbar;
