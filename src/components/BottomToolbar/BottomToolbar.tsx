import { CSSProperties, ReactInstance, ReactNode, RefObject, forwardRef, useContext, useState } from "react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ToolbarButton } from "../Button/Button";
import { exportComponentAsPNG } from "react-component-export-image";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import html2canvas from "html2canvas";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { EMPTY_GRID, PlacedPentomino, SOLVE_AREA } from "../../constants";
import { random, range } from "lodash";
import { PRESET_SIZES, RANDOM_TERRAIN_ALLOWED, invalidSolve } from "./bottomToolbar.utils";
import { PENTOMINOES } from "../../pentominoes";

const BottomToolbar = forwardRef(({ style }: { style: CSSProperties }, ref) => {
  const { clearGrid, newGrid, grid, surface } = useContext(GameStateContext);
  const { appPreferences, setSettingsOpen: updateSettingsOpen } = useContext(AppStateContext);
  const [copied, setCopied] = useState(false);
  const [newBoardOpen, setNewBoardOpen] = useState(false);
  return (
    <Toolbar.Root
      style={style as CSSProperties}
      className="pl-2 space-x-3 my-2 w-full flex justify-start"
      aria-label="Game controls"
    >
      <DropdownMenu.Root open={newBoardOpen} onOpenChange={setNewBoardOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            className={clsx(
              "cursor-pointer p-2 rounded mb-2",
              "shadow-sm shadow-zinc-900 dark:shadow-none dark:border dark:border-zinc-500",
              "flex flex-row items-center gap-2",
              "IconButton"
            )}
            aria-label="New board"
          >
            New board
            <HamburgerMenuIcon />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={clsx(
              "shadow-sm shadow-zinc-900 dark:shadow-none dark:border dark:border-zinc-500",
              "DropdownMenuContent",
              "text-black dark:text-gray-50",
              "bg-gray-100 dark:bg-gray-900 dark:text-gray-50",
              "rounded py-2",
              "text-right"
            )}
            align="start"
          >
            <DropdownItem
              onClick={(e) => {
                e.preventDefault();
                clearGrid(false);
                setNewBoardOpen(false);
              }}
            >
              Same Dimensions
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                let nextGrid: PlacedPentomino[][] = [];
                do {
                  nextGrid = EMPTY_GRID(RANDOM_TERRAIN_ALLOWED.height, RANDOM_TERRAIN_ALLOWED.width);
                  range(grid.length * grid[0].length, SOLVE_AREA).forEach(() => {
                    let x = random(RANDOM_TERRAIN_ALLOWED.height - 1);
                    let y = random(RANDOM_TERRAIN_ALLOWED.width - 1);
                    while (nextGrid[x][y].pentomino.name !== PENTOMINOES.None.name) {
                      x = random(RANDOM_TERRAIN_ALLOWED.height);
                      y = random(RANDOM_TERRAIN_ALLOWED.width);
                    }
                    nextGrid[x][y].pentomino = PENTOMINOES.R;
                  });
                } while (invalidSolve(nextGrid));
                newGrid(nextGrid);
                setNewBoardOpen(false);
              }}
              aria-label="Randomize terrain"
            >
              8x8 (random terrain)
            </DropdownItem>
            {PRESET_SIZES.map((size, i) => (
              <DropdownItem
                onClick={(e) => {
                  e.preventDefault();
                  newGrid(EMPTY_GRID(size.width, size.height));
                  setNewBoardOpen(false);
                }}
                key={i}
              >{`${size.width}x${size.height}`}</DropdownItem>
            ))}
            <DropdownItem
              onClick={(e) => {
                e.preventDefault();
                updateSettingsOpen(true);
                setNewBoardOpen(false);
              }}
            >
              Custom Dimensions
            </DropdownItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <ToolbarButton
        onClick={() => {
          clearGrid(true);
        }}
        aria-label="Clear Solve"
      >
        Clear solve
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

const DropdownItem = ({ children, ...rest }: { children: ReactNode } & DropdownMenu.DropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className={clsx("DropdownMenuItem", "px-2 cursor-pointer hover:bg-blue-300 dark:hover:bg-blue-950")}
      {...rest}
    >
      {children}
    </DropdownMenu.Item>
  );
};

export default BottomToolbar;
