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

interface CurrentState {
  pentominoSize: number;
  height: number;
  width: number;
  numVisibleColors: number;
  displayColors: string[];
  pentominoColors: Colors;
  surface: Surface;
  showKeyboardIndicators: boolean;
  copyImage: boolean;
}

export const Settings = () => {
  const {
    pentominoSize,
    updatePentominoSize,
    displayColors,
    updateDisplayColors,
    numVisibleColors,
    updateNumVisibleColors,
    copyImage,
    updateCopyImage,
  } = useContext(AppStateContext);
  const {
    grid,
    setGrid,
    pentominoColors,
    setPentominoColors,
    surface,
    setSurface,
    showKeyboardIndicators,
    setShowKeyboardIndicators,
  } = useContext(GameStateContext);

  const getCurrentState = () => ({
    height: grid.length,
    width: grid[0].length,
    pentominoSize,
    numVisibleColors,
    displayColors,
    pentominoColors,
    surface,
    showKeyboardIndicators,
    copyImage,
  });

  const [currentState, setCurrentState] = useState<CurrentState>(getCurrentState);

  return (
    <Modal
      trigger={<Cog8ToothIcon className="h-6 w-6" />}
      onOpenAutoFocus={() => {
        setCurrentState(getCurrentState());
      }}
    >
      <Dialog.Title className="text-center font-bold text-md mb-2">Tile Size</Dialog.Title>
      <fieldset className="flex gap-4 items-center mb-4">
        <label className="text-right" htmlFor="name">
          Size
        </label>
        <select
          className="bg-white dark:bg-slate-950"
          id="name"
          value={currentState.pentominoSize}
          onChange={(e) => {
            setCurrentState({ ...currentState, pentominoSize: toNumber(e.target.value) });
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
          value={currentState.width}
          pattern="[0-9]*"
          onChange={(e) => {
            const valAsNum = toNumber(e.target.value);
            if (isNaN(valAsNum)) return;
            setCurrentState({ ...currentState, width: Math.min(valAsNum, MAX_DIMENSION_SIZE) });
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
          value={currentState.height}
          pattern="[0-9]*"
          onChange={(e) => {
            const valAsNum = toNumber(e.target.value);
            if (isNaN(valAsNum)) return;
            setCurrentState({ ...currentState, height: Math.min(valAsNum, MAX_DIMENSION_SIZE) });
          }}
        />
      </fieldset>
      <div className="ml-4">
        Computed area:{" "}
        <span className={clsx(currentState.height * currentState.width >= 60 ? "text-green-700" : "text-red-500")}>
          {currentState.width * currentState.height}
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
          value={currentState.surface.name}
          onChange={(e) => {
            setCurrentState({ ...currentState, surface: SURFACES[e.target.value as keyof typeof SURFACES] });
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
      {currentState.surface === SURFACES.Sphere && currentState.width !== currentState.height && (
        <ErrorText>{currentState.surface.name} requires equal width & height</ErrorText>
      )}
      <Dialog.Title className="text-center font-bold text-md mb-2">Hotkey preferences</Dialog.Title>
      <fieldset className="flex gap-4 items-center mb-4">
        <label className="text-right" htmlFor="showIndicators">
          Show hotkey indicators
        </label>
        <input
          className="bg-white dark:bg-slate-950"
          type="checkbox"
          id="showIndicators"
          checked={currentState.showKeyboardIndicators}
          onChange={(e) => {
            setCurrentState({ ...currentState, showKeyboardIndicators: e.target.checked });
          }}
        />
      </fieldset>
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
          value={currentState.numVisibleColors}
          pattern="[0-9]*"
          onChange={(e) => {
            const valAsNum = toNumber(e.target.value);
            if (isNaN(valAsNum)) return;
            setCurrentState({ ...currentState, numVisibleColors: valAsNum });
          }}
        />
      </fieldset>
      <ColorSettings
        displayColors={currentState.displayColors}
        updateDisplayColors={(newColors) => {
          setCurrentState({ ...currentState, displayColors: newColors });
        }}
        pentominoColors={currentState.pentominoColors}
        updatePentominoColors={(newColors) => {
          setCurrentState({ ...currentState, pentominoColors: newColors });
        }}
        numColors={currentState.numVisibleColors}
      ></ColorSettings>
      <div className="flex flex-row gap-4">
        <Button
          onClick={() => {
            setCurrentState({ ...currentState, displayColors: DEFAULT_DISPLAY_COLORS });
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
                const val = i % currentState.numVisibleColors;
                acc[p] = val;
                return acc;
              },
              { ...DEFAULT_COLORS }
            );

            setCurrentState({ ...currentState, pentominoColors: nextColors });
          }}
        >
          Randomize Distribution
        </Button>
      </div>
      <Dialog.Title className="text-center font-bold text-md mb-2">Other</Dialog.Title>
      <fieldset className="flex gap-4 items-center mb-4">
        <label className="text-right" htmlFor="copyImage">
          Copy screenshots (instead of downloading)
        </label>
        <input
          className="bg-white dark:bg-slate-950"
          type="checkbox"
          id="copyImage"
          checked={currentState.copyImage}
          onChange={(e) => {
            setCurrentState({ ...currentState, copyImage: e.target.checked });
          }}
        />
      </fieldset>
      {currentState.copyImage && typeof ClipboardItem === "undefined" && (
        <ErrorText>
          Please enable <code>dom.events.asyncClipboard.clipboardItem</code> in <code>about:config</code> in Firefox to
          enable copying screenshots
        </ErrorText>
      )}
      {(currentState.width !== grid[0].length || currentState.height !== grid.length) && (
        <ErrorText>Saving will clear your current board!</ErrorText>
      )}{" "}
      <div className="mt-6 flex justify-end">
        <Dialog.Close asChild>
          <Button
            onClick={() => {
              updatePentominoSize(currentState.pentominoSize);
              updateDisplayColors(currentState.displayColors);
              updateNumVisibleColors(Math.min(currentState.numVisibleColors, MAX_NUM_COLORS));
              if (currentState.height !== grid.length || currentState.width !== grid[0].length) {
                setGrid(
                  range(currentState.height).map((x) =>
                    range(currentState.width).map((y) => {
                      return EMPTY_PENTOMINO(x, y);
                    })
                  )
                );
              }

              setSurface(currentState.surface);
              setPentominoColors(currentState.pentominoColors);
              setShowKeyboardIndicators(currentState.showKeyboardIndicators);
              updateCopyImage(currentState.copyImage);
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
