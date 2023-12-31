import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { cloneDeep, range, toNumber } from "lodash";
import { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import {
  Colors,
  DEFAULT_DISPLAY_COLORS,
  MAX_DIMENSION_SIZE,
  MAX_NUM_COLORS,
  randomPentominoColors,
  SOLVE_AREA,
  SURFACES,
} from "../../constants";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { ColorSettings } from "../ColorSettings/ColorSettings";
import { Cog8ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { CurrentState, DEFAULT_SETTINGS_CONFIG } from "./settingsConstants";
import {
  errorConfig,
  errorSphere,
  warnDimensions,
  errorCopyScreenshots,
  errorWidth,
  errorHeight,
  gridChangeNeeded,
  duplicateKeybindsAtLetter,
  duplicateKeybinds,
} from "./validateSettings";
import { DEFAULT_HOTKEY_MAP, HotkeyMap, HotkeyableAction } from "../GameStateProvider/gameConstants";
import { produce } from "immer";

function getNumVisibleColors(numVisibleColors: number, defaultRandomColors: boolean, pentominoColors: Colors): number {
  if (!defaultRandomColors) return numVisibleColors;
  const maxColorValue = Object.values(pentominoColors).reduce((acc, c) => {
    return Math.max(acc, c);
  }, 0);
  return Math.max(numVisibleColors, maxColorValue + 1);
}

export const Settings = () => {
  const {
    appPreferences,
    updateAppPreferences,
    settingsOpen,
    setSettingsOpen: updateSettingsOpen,
  } = useContext(AppStateContext);
  const {
    grid,
    resetGrid,
    pentominoColors,
    setPentominoColors,
    surface,
    setSurface,
    showKeyboardIndicators,
    setShowKeyboardIndicators,
    defaultRandomColors,
    updateDefaultRandomColors,
    defaultAddTerrain,
    updateDefaultAddTerrain,
    hotkeys,
    hotkeyMap,
    updateHotkeyMap,
  } = useContext(GameStateContext);

  const [currentState, setCurrentState] = useState<CurrentState>({ ...DEFAULT_SETTINGS_CONFIG });
  const [currentHotkeyMap, setCurrentHotkeyMap] = useState<HotkeyMap>([]);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [warnGridReset, setWarnGridReset] = useState<boolean>(false);

  function nextColorsOnMaxChange(newMax: number) {
    return Object.entries(currentState.pentominoColors).reduce((acc: Colors, [p, c]) => {
      acc[p] = c >= newMax ? 0 : c;
      return acc;
    }, {});
  }

  function updateCurrentState(newState: Partial<CurrentState>) {
    const nextState = { ...currentState, ...newState };
    setCurrentState(nextState);
    if (warnGridReset) {
      setWarnGridReset(gridChangeNeeded(nextState, { height: grid.length, width: grid[0].length }));
    }
  }
  return (
    <Modal
      trigger={<Cog8ToothIcon className="h-10 w-10  text-gray-800 dark:text-gray-300" />}
      onOpenAutoFocus={() => {
        setCurrentState({
          height: grid.length,
          width: grid[0].length,
          pentominoSize: appPreferences.pentominoSize,
          numVisibleColors: getNumVisibleColors(appPreferences.numVisibleColors, defaultRandomColors, pentominoColors),
          displayColors: appPreferences.displayColors,
          pentominoColors,
          surface,
          copyImage: appPreferences.copyImage,
          showCdot: appPreferences.showCdot,
          showKeyboardIndicators,
          defaultRandomColors,
          defaultAddTerrain,
        });
        setShowErrors(false);
        setWarnGridReset(false);
        setCurrentHotkeyMap(cloneDeep(hotkeyMap));
      }}
      open={settingsOpen}
      onOpenChange={updateSettingsOpen as Dispatch<SetStateAction<boolean>>}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowErrors(true);
          let returnEarly = false;
          if (errorConfig(currentState)) returnEarly = true;
          if (duplicateKeybinds(currentHotkeyMap)) returnEarly = true;
          if (gridChangeNeeded(currentState, { height: grid.length, width: grid[0].length })) {
            if (!warnGridReset) {
              setWarnGridReset(true);
              returnEarly = true;
            } else if (!returnEarly) {
              resetGrid({ height: currentState.height, width: currentState.width });
            }
          }
          if (returnEarly) return;

          // done with validation

          updateAppPreferences(
            currentState.pentominoSize,
            currentState.displayColors,
            Math.min(currentState.numVisibleColors, MAX_NUM_COLORS),
            currentState.copyImage,
            currentState.showCdot
          );

          setSurface(currentState.surface);
          setPentominoColors(currentState.pentominoColors);
          setShowKeyboardIndicators(currentState.showKeyboardIndicators);
          updateHotkeyMap(currentHotkeyMap);

          updateDefaultRandomColors(currentState.defaultRandomColors);
          updateDefaultAddTerrain(currentState.defaultAddTerrain);
          updateSettingsOpen(false);
        }}
      >
        <div className="px-4">
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
          <div className="flex flex-row justify-around">
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
                  updateCurrentState({ width: valAsNum });
                }}
              />
            </fieldset>
            {showErrors && errorWidth(currentState) && (
              <ErrorText>Width must be between 3 & {MAX_DIMENSION_SIZE}, inclusive</ErrorText>
            )}
            <fieldset className="flex gap-4 items-center mb-4">
              <label className="text-right" htmlFor="height">
                Height
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
                  updateCurrentState({ height: valAsNum });
                }}
              />
            </fieldset>
          </div>
          {showErrors && errorHeight(currentState) && (
            <ErrorText>Height must be between 3 & {MAX_DIMENSION_SIZE}, inclusive</ErrorText>
          )}
          <div className="ml-4">
            Computed area:{" "}
            <span
              className={clsx(
                currentState.height * currentState.width >= SOLVE_AREA ? "text-green-700" : "text-red-500"
              )}
            >
              {currentState.width * currentState.height}
            </span>{" "}
            {warnDimensions(currentState) && `(Minimum area ${SOLVE_AREA} if you want to place all tiles)`}
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
          {showErrors && errorSphere(currentState) && (
            <ErrorText>{currentState.surface.name} requires equal width & height</ErrorText>
          )}
          <Dialog.Title className="text-center font-bold text-md mb-2">Pentomino tile colors</Dialog.Title>
          <Dialog.Description className="italic mb-1">Click & drag to rearrange</Dialog.Description>
          <fieldset className="flex gap-4 items-center mb-4">
            <label className="text-right" htmlFor="numColors">
              Number of colors
            </label>
            <select
              className="bg-white dark:bg-slate-950"
              id="numColors"
              value={currentState.numVisibleColors}
              onChange={(e) => {
                const valAsNum = toNumber(e.target.value);
                if (isNaN(valAsNum)) return;
                setCurrentState({
                  ...currentState,
                  numVisibleColors: valAsNum,
                  pentominoColors: nextColorsOnMaxChange(valAsNum),
                });
              }}
            >
              {range(MAX_NUM_COLORS).map((n) => (
                <option value={n + 1} key={n}>
                  {n + 1}
                </option>
              ))}
            </select>
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentState({ ...currentState, displayColors: DEFAULT_DISPLAY_COLORS });
              }}
            >
              Reset Colors
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentState({
                  ...currentState,
                  pentominoColors: randomPentominoColors(currentState.numVisibleColors),
                });
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
          {showErrors && errorCopyScreenshots(currentState) && (
            <ErrorText>
              Please enable <code>dom.events.asyncClipboard.clipboardItem</code> in <code>about:config</code> in Firefox
              to enable copying screenshots
            </ErrorText>
          )}
          <fieldset className="flex gap-4 items-center mb-4">
            <label className="text-right" htmlFor="showCdot">
              Show dot in tiles on board
            </label>
            <input
              className="bg-white dark:bg-slate-950"
              type="checkbox"
              id="showCdot"
              checked={currentState.showCdot}
              onChange={(e) => {
                setCurrentState({ ...currentState, showCdot: e.target.checked });
              }}
            />
          </fieldset>
          <fieldset className="flex gap-4 items-center mb-4">
            <label className="text-right" htmlFor="randc">
              Default to random pentomino colors
            </label>
            <input
              className="bg-white dark:bg-slate-950"
              type="checkbox"
              id="randc"
              checked={currentState.defaultRandomColors}
              onChange={(e) => {
                setCurrentState({ ...currentState, defaultRandomColors: e.target.checked });
              }}
            />
          </fieldset>
          <fieldset className="flex gap-4 items-center mb-4">
            <label className="text-right" htmlFor="initterrain">
              Add 4 squares of terrain when URL is empty?
            </label>
            <input
              className="bg-white dark:bg-slate-950"
              type="checkbox"
              id="initterrain"
              checked={currentState.defaultAddTerrain}
              onChange={(e) => {
                setCurrentState({ ...currentState, defaultAddTerrain: e.target.checked });
              }}
            />
          </fieldset>
          <Dialog.Title className="text-center font-bold text-md mb-2">Hotkeys</Dialog.Title>
          <fieldset className="flex gap-4 items-center mb-4">
            <label className="text-right" htmlFor="showIndicators">
              Show current-selection indicators
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
          <div className="italic mb-2">
            You can also <b>undo</b> with <code>Ctrl+Z</code>.
          </div>
          {currentHotkeyMap.map((hotkey, i) => {
            return (
              <fieldset className="flex gap-4 items-center mb-4" key={HotkeyableAction[hotkey.action]}>
                <label className="text-right" htmlFor={`hotkey-${hotkey.action}`}>
                  {hotkeys[hotkey.action].text}
                </label>
                <input
                  className="bg-white dark:bg-slate-950"
                  size={10}
                  id={`hotkey-${hotkey.action}`}
                  value={hotkey.keybind}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.key === hotkey.keybind) return;
                    setCurrentHotkeyMap(
                      produce(currentHotkeyMap, (draftHotkeyMap) => {
                        if (e.key === " ") {
                          draftHotkeyMap[i].keybind = "Space";
                          return;
                        }
                        draftHotkeyMap[i].keybind = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                      })
                    );
                  }}
                  onChange={() => {}}
                />
                {duplicateKeybindsAtLetter(currentHotkeyMap, hotkey.keybind) && (
                  <XMarkIcon width="25px" className="text-red-500" />
                )}
              </fieldset>
            );
          })}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentHotkeyMap(cloneDeep(DEFAULT_HOTKEY_MAP));
            }}
          >
            Reset Hotkeys
          </Button>
        </div>
        {/* End of settings area */}
        {/* Start confirmation area */}
        <div className={clsx("sticky bottom-0 px-8", "bg-gray-400 dark:bg-slate-900", "pt-2", "rounded-t-xl")}>
          {warnGridReset && <ErrorText>Saving will clear your current board! Submit again to proceed.</ErrorText>}
          {showErrors && errorConfig(currentState) && (
            <ErrorText>One or more errors detected, see field-specific warnings.</ErrorText>
          )}
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

const ErrorText = ({ children }: { children: ReactNode }) => {
  return <div className="text-red-500 mb-2 italic flex flex-row justify-end">{children}</div>;
};
