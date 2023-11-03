import * as Dialog from "@radix-ui/react-dialog";
import { EMPTY_GRID, SURFACES } from "../../constants";
import { Coordinates, PENTOMINOES } from "../../pentominoes";
import { Grid } from "../Grid/Grid";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";
import { Modal } from "../Modal/Modal";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ReactNode, useContext, useState } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import clsx from "clsx";
import { getPaintedBoard } from "../GameStateProvider/paintGrid";
import { InfoGrid } from "../Grid/InfoGrid";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";

interface GridExample {
  w: number;
  l: number;
  terrain: Coordinates[];
}

const gridExampleStructure: GridExample[] = [
  {
    w: 8,
    l: 8,
    terrain: [
      { x: 3, y: 3 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 3, y: 4 },
    ],
  },
  {
    w: 8,
    l: 8,
    terrain: [
      { x: 2, y: 2 },
      { x: 5, y: 5 },
      { x: 5, y: 2 },
      { x: 2, y: 5 },
    ],
  },
  {
    w: 8,
    l: 8,
    terrain: [
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 6, y: 1 },
      { x: 6, y: 2 },
    ],
  },
  {
    w: 8,
    l: 8,
    terrain: [
      { x: 7, y: 1 },
      { x: 7, y: 0 },
      { x: 6, y: 1 },
      { x: 6, y: 0 },
    ],
  },
  {
    w: 8,
    l: 8,
    terrain: [
      { x: 7, y: 7 },
      { x: 0, y: 0 },
      { x: 0, y: 7 },
      { x: 7, y: 0 },
    ],
  },
  {
    w: 8,
    l: 8,
    terrain: [
      { x: 1, y: 1 },
      { x: 6, y: 6 },
      { x: 1, y: 6 },
      { x: 6, y: 1 },
    ],
  },
  {
    w: 10,
    l: 6,
    terrain: [],
  },
  {
    w: 12,
    l: 5,
    terrain: [],
  },
];

const exampleGrids = gridExampleStructure.map((e) => {
  const grid = EMPTY_GRID(e.w, e.l);
  e.terrain.forEach(({ x, y }) => {
    grid[x][y].pentomino = PENTOMINOES.R;
  });
  return grid;
});

export const Information = () => {
  const { darkMode, setSettingsOpen } = useContext(AppStateContext);
  const { hotkeyMap, hotkeys } = useContext(GameStateContext);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  return (
    <Modal
      open={infoOpen}
      onOpenChange={setInfoOpen}
      trigger={<QuestionMarkCircleIcon className="h-10 w-10 text-gray-800 dark:text-gray-300" />}
    >
      <Dialog.Title className="text-center font-bold text-md mb-2">About Pentominoes</Dialog.Title>
      <div className="px-4 pb-4">
        <div className="mb-2">
          Pentominoes are tiles of area 5. There are 12 distinct pentominoes, up to rotation & reflection, with each
          tile having somewhere between 2 (the {<InformationPentominoDisplay p="I" />} tile) and 8 (
          {<InformationPentominoDisplay p="F" />} {<InformationPentominoDisplay p="L" />}{" "}
          {<InformationPentominoDisplay p="N" />} {<InformationPentominoDisplay p="P" />}{" "}
          {<InformationPentominoDisplay p="Y" />}) distinct orientations.
        </div>
        <div className="mb-2">
          This puzzle game also provides a one-square-unit-area tile that you can use as terrain (the{" "}
          <InformationPentominoDisplay p="R"></InformationPentominoDisplay> tile).
        </div>
        <div className="mb-2">
          There are several different ways to enjoy Pentominoes, but the common theme is that you will try to fully tile
          a grid of total area 60 (5x12=60) such that no pentominoes overlap or fall off the edge, and no empty squares
          remain (other than whatever terrain you choose to place before starting to solve the puzzle).
        </div>
        <div className="mb-2">
          Generally, you want to use one of each pentomino to tile the board, but you're welcome to use this app however
          you like, and there are no prohibitions against using a tile more than once unless you want there to be. One
          suggestion is to attempt to tile an area with just the {<InformationPentominoDisplay p="P" />} tile.
        </div>
        <div className="mb-2">
          For an added challenge, you can also choose to apply "colorways" to your tiles. Then, constrain yourself to
          make a solve where the 4 tiles of some color must be pairwise non-adjacent; or must be adjacent; or must be
          adjacent and form a line spanning the grid area (this last one is especially fun in 8x8 grids with 4 squares
          of terrain). Setting these colorways is available in the Settings dialog.
        </div>
        <div>
          If you're new to pentominoes, feel free to "cheat" in your first few solve attempts and move terrain around,
          or use one piece twice - this is a single-player puzzle game, so the rules are whatever you make them to be!
        </div>
        <Dialog.Title className="text-center font-bold text-md mb-2">Hotkeys</Dialog.Title>
        <span className="italic mb-2">
          You can{" "}
          <span
            className="text-blue-600 dark:text-blue-400 cursor-pointer underline"
            onClick={(e) => {
              e.preventDefault();
              setInfoOpen(false);
              setSettingsOpen(true);
            }}
          >
            customize hotkeys
          </span>{" "}
          in the Settings menu.
        </span>
        <KeyboardKeyInfo>
          <KeyboardKey>Ctrl</KeyboardKey> + <KeyboardKey>Z</KeyboardKey>
          <span>=</span>Undo last action that modified the grid
        </KeyboardKeyInfo>
        {hotkeyMap.map((hotkey, i) => (
          <KeyboardKeyInfo key={i}>
            <KeyboardKey>{hotkey.keybind}</KeyboardKey>
            <span>=</span>
            {hotkeys[hotkey.action].text}
          </KeyboardKeyInfo>
        ))}
        <Dialog.Title className="text-center font-bold text-md mb-2">Suggested Puzzles</Dialog.Title>
        <div className="flex flex-row flex-wrap gap-3 justify-center">
          {exampleGrids.map((grid, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <InfoGrid grid={grid}>
                <Grid
                  pentominoSize={4}
                  paintedGrid={getPaintedBoard(grid, SURFACES.Rectangle, undefined, false)}
                  borderColor={darkMode ? "#F3F4F6" : "black"}
                />
              </InfoGrid>
              Width: {grid[0].length} Length: {grid.length}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const InformationPentominoDisplay = ({ p }: { p: string }) => {
  return (
    <span className="inline-block align-middle mx-1">
      <PentominoDisplay pentomino={PENTOMINOES[p]} size={2} checkGrid={false}></PentominoDisplay>
    </span>
  );
};

const KeyboardKeyInfo = ({ children }: { children: ReactNode }) => {
  return <p className="mb-2 flex flex-row items-center gap-2">{children}</p>;
};

const KeyboardKey = ({ children }: { children: ReactNode }) => {
  return (
    <span className={clsx("px-1 border border-black dark:border-white rounded", " min-w-[1.5rem] text-center")}>
      {children}
    </span>
  );
};
