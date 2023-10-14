import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { range, toNumber } from "lodash";
import { ReactNode, useContext, useState } from "react";
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
  Surface,
  SURFACES,
} from "../../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ColorSettings } from "../ColorSettings/ColorSettings";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";

export const Settings = () => {
  const {
    pentominoSize,
    updatePentominoSize,
    displayColors,
    updateDisplayColors,
    numVisibleColors,
    updateNumVisibleColors,
  } = useContext(AppStateContext);
  const { grid, setGrid, pentominoColors, setPentominoColors, surface, setSurface } = useContext(GameStateContext);
  const [curPentominoSize, setCurPentominoSize] = useState(pentominoSize);
  const [curHeight, setCurHeight] = useState(grid.length);
  const [curWidth, setCurWidth] = useState(grid[0].length);
  const [curNumColors, setCurNumColors] = useState(numVisibleColors);
  const [curDColors, setCurDColors] = useState(displayColors);
  const [curPColors, setCurPColors] = useState<Colors>({ ...pentominoColors });
  const [curSurface, setCurSurface] = useState<Surface>(surface);

  return (
    <Modal button={<Cog8ToothIcon className="h-6 w-6" />}>
      <Dialog.Title className="text-center font-bold text-md mb-2">Tile Size</Dialog.Title>
      <fieldset className="flex gap-4 items-center mb-4">
        <label className="text-right" htmlFor="name">
          Size
        </label>
        <select
          className="bg-white dark:bg-slate-950"
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
      <Dialog.Title className="text-center font-bold text-md mb-2">Grid shape</Dialog.Title>
      <fieldset className="flex gap-4 items-center mb-4">
        <label className="text-right" htmlFor="width">
          Width
        </label>
        <input
          className="bg-white dark:bg-slate-950"
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
          Length
        </label>
        <input
          className="bg-white dark:bg-slate-950"
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
      <div className="ml-4">
        Computed area:{" "}
        <span className={clsx(curHeight * curWidth >= 60 ? "text-green-700" : "text-red-500")}>
          {curWidth * curHeight}
        </span>{" "}
        (min: 60)
      </div>
      <fieldset className="flex gap-4 items-center mb-4">
        <label className="text-right" htmlFor="surface">
          Surface
        </label>
        <select
          className="bg-white dark:bg-slate-950"
          id="surface"
          value={curSurface.name}
          onChange={(e) => {
            setCurSurface(SURFACES[e.target.value as keyof typeof SURFACES]);
          }}
        >
          <optgroup label="Orientable">
            <option value="Rectangle">Rectangle</option>
            <option value="Cylinder">Cylinder</option>
            <option value="Sphere">Sphere</option>
            <option value="Torus">Torus</option>
          </optgroup>
          <optgroup label="Nonorientable">
            <option value="Mobius">Mobius Band</option>
            <option value="ProjectivePlane">Projective Plane</option>
            <option value="KleinBottle">Klein Bottle</option>
          </optgroup>
        </select>
      </fieldset>
      {curSurface === SURFACES.Sphere && curWidth !== curHeight && (
        <ErrorText>{curSurface.name} requires equal width & height</ErrorText>
      )}
      <Dialog.Title className="text-center font-bold text-md mb-2">Pentomino tile colors</Dialog.Title>
      <Dialog.Description className="italic mb-1">Click & drag to rearrange</Dialog.Description>

      <fieldset className="flex gap-4 items-center mb-4">
        <label className="text-right" htmlFor="numColors">
          Number of colors
        </label>
        <input
          className="bg-white dark:bg-slate-950"
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
        <Button
          onClick={() => {
            setCurDColors(DEFAULT_DISPLAY_COLORS);
          }}
        >
          Reset Colors
        </Button>
        <Button
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
        </Button>
      </div>
      {(curWidth !== grid[0].length || curHeight !== grid.length) && (
        <ErrorText>Saving will clear your current board!</ErrorText>
      )}
      <div className="mt-6 flex justify-end">
        <Dialog.Close asChild>
          <Button
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

              setSurface(curSurface);
              setPentominoColors(curPColors);
            }}
          >
            Save changes
          </Button>
        </Dialog.Close>
      </div>
    </Modal>
  );
};

const ErrorText = ({ children }: { children: ReactNode }) => {
  return <div className="text-red-500">{children}</div>;
};
