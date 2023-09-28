import * as Dialog from "@radix-ui/react-dialog";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { EMPTY_GRID } from "../../constants";
import { Coordinates, PENTOMINOES } from "../../pentominoes";
import { Board } from "../Board/Board";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";

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
  const grid = EMPTY_GRID(e.l, e.w);
  e.terrain.forEach(({ x, y }) => {
    grid[x][y].pentomino = PENTOMINOES.R;
  });
  return grid;
});

export const Information = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-black h-6 w-6">
          <QuestionMarkCircleIcon />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-900 opacity-40 fixed inset-0" />
        <Dialog.Content className="bg-gray-200 rounded-lg fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-8 shadow-md shadow-gray-500 max-h-[90vh] overflow-y-auto w-[min(90vw,_48rem)]">
          <Dialog.Title className="text-center font-bold text-md mb-2">About Pentominoes</Dialog.Title>
          <p className="mb-2">
            Pentominoes are tiles of area 5. There are 12 distinct pentominoes, up to rotation & reflection, with each
            tile having somewhere between 2 (the {<InformationPentominoDisplay p="I" />} tile) and 8 (
            {<InformationPentominoDisplay p="F" />} {<InformationPentominoDisplay p="L" />}{" "}
            {<InformationPentominoDisplay p="N" />} {<InformationPentominoDisplay p="P" />}{" "}
            {<InformationPentominoDisplay p="Y" />}) distinct orientations.
          </p>
          <p className="mb-2">
            There are several different ways to enjoy the puzzle game of Pentominoes, but the common theme is that you
            will try to fully tile a grid of total area 60 (5x12=60) such that no pentominoes overlap or fall off the
            edge, and no empty squares remain (other than whatever terrain you choose to place before starting to solve
            the puzzle).
          </p>
          <p className="mb-2">
            Generally, you want to use one of each pentomino to tile the board, but you're welcome to use this app
            however you like, and there are no prohibitions against using a tile more than once unless you want there to
            be. One suggestion is to attempt to tile an area with just the {<InformationPentominoDisplay p="P" />} tile.
          </p>
          <p className="mb-2">
            For an added challenge, you can also choose to apply "colorways" to your tiles. Then, constrain yourself to
            make a solve where the 4 tiles of some color must be pairwise non-adjacent; or must be adjacent; or must be
            adjacent and form a line spanning the grid area (this last one is especially fun in 8x8 grids with 4 squares
            of terrain). Setting these colorways is available in the Settings dialog.
          </p>
          <p>
            If you're new to pentominoes, feel free to "cheat" in your first few solve attempts and move terrain around,
            or use one piece twice - this is a single-player puzzle game, so the rules are whatever you make them to be!
          </p>
          <Dialog.Title className="text-center font-bold text-md mb-2">Hotkeys</Dialog.Title>
          You can use <code>Ctrl+Z</code> to undo your last grid-modifying action (adding or removing a piece).
          <Dialog.Title className="text-center font-bold text-md mb-2">Suggested Puzzles</Dialog.Title>
          <div className="flex flex-row flex-wrap gap-3 justify-center">
            {exampleGrids.map((grid, i) => (
              <div className="flex flex-col items-center justify-center">
                <Board key={i} grid={grid} pentominoSize={4} borderColor="black"></Board>
                Width: {grid.length} Length: {grid[0].length}
              </div>
            ))}
          </div>
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 hover:text-red-600" aria-label="Close">
              <XMarkIcon className="text-black h-6 w-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const InformationPentominoDisplay = ({ p }: { p: string }) => {
  return (
    <div className="inline-block align-middle">
      <PentominoDisplay pentomino={PENTOMINOES[p]} size={2} checkGrid={false}></PentominoDisplay>
    </div>
  );
};
