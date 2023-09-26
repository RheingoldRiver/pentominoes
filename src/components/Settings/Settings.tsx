import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, GearIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { range, toNumber } from "lodash";
import { useContext, useState } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import {
  Colors,
  DEFAULT_COLORS,
  DEFAULT_DISPLAY_COLORS,
  EMPTY_PENTOMINO,
  MAX_DIMENSION_SIZE,
  MAX_NUM_COLORS,
  PENTOMINO_NAMES,
  shuffleArray,
} from "../../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ColorSettings } from "../ColorSettings/ColorSettings";

export const Settings = ({ ...rest }) => {
  const {
    pentominoSize,
    updatePentominoSize,
    displayColors,
    updateDisplayColors,
    numVisibleColors,
    updateNumVisibleColors,
  } = useContext(AppStateContext);
  const { grid, setGrid, pentominoColors, setPentominoColors } = useContext(GameStateContext);
  const [curPentominoSize, setCurPentominoSize] = useState(pentominoSize);
  const [curHeight, setCurHeight] = useState(grid.length);
  const [curWidth, setCurWidth] = useState(grid[0].length);
  const [curNumColors, setCurNumColors] = useState(numVisibleColors);
  const [curDColors, setCurDColors] = useState(displayColors);
  const [curPColors, setCurPColors] = useState<Colors>({ ...pentominoColors });

  return (
    <div {...rest} className="flex flex-row items-start justify-end w-full h-full pr-2">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button>
            <GearIcon />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-gray-900 opacity-40 fixed inset-0" />
          <Dialog.Content className="bg-gray-200 rounded-lg fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-8 shadow-md shadow-gray-500 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-center font-bold text-md mb-2">Settings</Dialog.Title>
            <Dialog.Description className="text-xs mb-4">Change view & puzzle settings</Dialog.Description>
            <fieldset className="flex gap-4 items-center mb-4">
              <label className="text-right" htmlFor="name">
                Size
              </label>
              <select
                className="Input"
                id="name"
                value={curPentominoSize}
                onChange={(e) => {
                  setCurPentominoSize(toNumber(e.target.value));
                }}
              >
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
              </select>
            </fieldset>
            <fieldset className="flex gap-4 items-center mb-4">
              <label className="text-right" htmlFor="width">
                Grid Width
              </label>
              <input
                className="Input"
                size={4}
                id="width"
                value={curWidth}
                pattern="[0-9]*"
                onChange={(e) => {
                  const valAsNum = toNumber(e.target.value);
                  if (isNaN(valAsNum)) return;
                  setCurWidth(Math.min(valAsNum, MAX_DIMENSION_SIZE));
                }}
              />
            </fieldset>
            <fieldset className="flex gap-4 items-center mb-4">
              <label className="text-right" htmlFor="height">
                Grid Height
              </label>
              <input
                className="Input"
                size={4}
                id="height"
                value={curHeight}
                pattern="[0-9]*"
                onChange={(e) => {
                  const valAsNum = toNumber(e.target.value);
                  if (isNaN(valAsNum)) return;
                  setCurHeight(Math.min(valAsNum, MAX_DIMENSION_SIZE));
                }}
              />
            </fieldset>
            <div>
              Computed area:{" "}
              <span className={clsx(curHeight * curWidth >= 60 ? "text-green-700" : "text-red-500")}>
                {curWidth * curHeight}
              </span>{" "}
              (min: 60)
            </div>
            <fieldset className="flex gap-4 items-center mb-4">
              <label className="text-right" htmlFor="numColors">
                Number of colors
              </label>
              <input
                className="Input"
                size={4}
                id="numColors"
                value={curNumColors}
                pattern="[0-9]*"
                onChange={(e) => {
                  const valAsNum = toNumber(e.target.value);
                  if (isNaN(valAsNum)) return;
                  setCurNumColors(valAsNum);
                }}
              />
            </fieldset>
            <ColorSettings
              curDColors={curDColors}
              setCurDColors={setCurDColors}
              curPColors={curPColors}
              setCurPColors={setCurPColors}
              curNumColors={curNumColors}
            ></ColorSettings>
            <div className="flex flex-row gap-4">
              <button
                className={clsx("cursor-pointer p-2 rounded", "shadow-sm shadow-zinc-600")}
                onClick={() => {
                  setCurDColors(DEFAULT_DISPLAY_COLORS);
                }}
              >
                Reset Colors
              </button>
              <button
                className={clsx("cursor-pointer p-2 rounded", "shadow-sm shadow-zinc-600")}
                onClick={() => {
                  const pentominoes = [...PENTOMINO_NAMES];
                  shuffleArray(pentominoes);
                  const nextColors = pentominoes.reduce(
                    (acc: Colors, p, i) => {
                      const val = i % curNumColors;
                      acc[p] = val;
                      return acc;
                    },
                    { ...DEFAULT_COLORS }
                  );

                  setCurPColors(nextColors);
                }}
              >
                Randomize Distribution
              </button>
            </div>
            {(curWidth !== grid[0].length || curHeight !== grid.length) && (
              <div className="text-red-500">Saving will clear your current board!</div>
            )}
            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button
                  className={clsx("cursor-pointer p-2 rounded", "shadow-sm shadow-zinc-900")}
                  onClick={() => {
                    updatePentominoSize(curPentominoSize);
                    updateDisplayColors(curDColors);
                    updateNumVisibleColors(Math.min(curNumColors, MAX_NUM_COLORS));
                    if (curHeight !== grid.length || curWidth !== grid[0].length) {
                      setGrid(
                        range(curHeight).map((x) =>
                          range(curWidth).map((y) => {
                            return EMPTY_PENTOMINO(x, y);
                          })
                        )
                      );
                    }

                    setPentominoColors(curPColors);
                  }}
                >
                  Save changes
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-3 right-3 hover:text-red-600" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
