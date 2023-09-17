import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, GearIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { range, toNumber } from "lodash";
import { useContext, useState } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { EMPTY_PENTOMINO } from "../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";

export const Settings = ({ ...rest }) => {
  const { pentominoSize, setPentominoSize, gridWidth, setGridWidth, gridHeight, setGridHeight } =
    useContext(AppStateContext);
  const { setGrid } = useContext(GameStateContext);
  const [curPentominoSize, setCurPentominoSize] = useState(pentominoSize);
  const [curGridWidth, setCurGridWidth] = useState(gridWidth);
  const [curGridHeight, setCurGridHeight] = useState(gridHeight);
  return (
    <div {...rest} className="flex flex-row items-start justify-end w-full h-full pr-2">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button>
            <GearIcon />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-gray-900 opacity-50 fixed inset-0" />
          <Dialog.Content className="bg-gray-200 rounded-lg fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-8">
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
              <label className="text-right" htmlFor="gridWidth">
                Grid Width
              </label>
              <input
                className="Input"
                id="gridWidth"
                value={curGridWidth}
                pattern="[0-9]*"
                onChange={(e) => {
                  const valAsNum = toNumber(e.target.value);
                  if (isNaN(valAsNum)) return;
                  setCurGridWidth(valAsNum);
                }}
              />
            </fieldset>
            <fieldset className="flex gap-4 items-center mb-4">
              <label className="text-right" htmlFor="gridHeight">
                Grid Height
              </label>
              <input
                className="Input"
                id="gridHeight"
                value={curGridHeight}
                pattern="[0-9]*"
                onChange={(e) => {
                  const valAsNum = toNumber(e.target.value);
                  if (isNaN(valAsNum)) return;
                  setCurGridHeight(valAsNum);
                }}
              />
            </fieldset>
            <div>
              Computed area:{" "}
              <span className={clsx(curGridHeight * curGridWidth >= 60 ? "text-green-700" : "text-red-500")}>
                {curGridWidth * curGridHeight}
              </span>{" "}
              (min: 60)
            </div>
            {(curGridWidth !== gridWidth || curGridHeight !== gridHeight) && (
              <div className="text-red-500">Saving will clear your current board!</div>
            )}
            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button
                  className={clsx("cursor-pointer p-2 rounded", "shadow-sm shadow-zinc-900")}
                  onClick={() => {
                    setPentominoSize(curPentominoSize);
                    setGridWidth(curGridWidth);
                    setGridHeight(curGridHeight);
                    setGrid(
                      range(0, curGridHeight).map((x) =>
                        range(0, curGridWidth).map((y) => {
                          return EMPTY_PENTOMINO(x, y);
                        })
                      )
                    );
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
