import { CSSProperties, ReactInstance, RefObject, forwardRef, useContext, useState } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ToolbarButton } from "../Button/Button";
import { exportComponentAsPNG } from "react-component-export-image";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import html2canvas from "html2canvas";

const BottomToolbar = forwardRef(({ style }: { style: CSSProperties }, ref) => {
  const { clearGrid, grid, surface } = useContext(GameStateContext);
  const { appPreferences } = useContext(AppStateContext);
  const [copied, setCopied] = useState(false);
  return (
    <Toolbar.Root
      style={style as CSSProperties}
      className="pl-2 space-x-3 my-2 w-full flex justify-start"
      aria-label="Game controls"
    >
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
      <ToolbarButton
        onClick={() => {
          if (appPreferences.copyImage === false) {
            exportComponentAsPNG(ref as RefObject<ReactInstance>, {
              fileName: `Pentominoes ${grid[0].length}x${grid.length} ${surface.name}`,
            });
            return;
          }
          if (!(ref && "current" in ref && ref.current)) return;
          html2canvas(ref.current as HTMLElement).then((canvas) => {
            canvas.toBlob((blob) => {
              if (!blob) return;
              navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 3000);
            });
          });
        }}
        className={copied ? "bg-green-300 dark:bg-green-700" : ""}
        aria-label="Screenshot board"
      >
        Screenshot
      </ToolbarButton>
    </Toolbar.Root>
  );
});

export default BottomToolbar;
