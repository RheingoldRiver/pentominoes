import { DEFAULT_HOTKEY_MAP } from "./../GameStateProvider/gameConstants";
import { SURFACES } from "./../../constants";
import { expect, test } from "vitest";
import { DEFAULT_SETTINGS_CONFIG } from "./settingsConstants";
import {
  duplicateKeybindsAtLetter,
  errorConfig,
  errorHeight,
  errorSphere,
  gridChangeNeeded,
  warnDimensions,
} from "./validateSettings";
import { cloneDeep } from "lodash";

test("default config has no errors", () => {
  expect(errorConfig({ ...DEFAULT_SETTINGS_CONFIG })).toBe(false);
});

test("sphere errors are caught correctly", () => {
  const config = { ...DEFAULT_SETTINGS_CONFIG };
  config.surface = SURFACES.Sphere;
  config.width = 5;
  expect(errorSphere(config)).toBe(true);
  config.height = 5;
  expect(errorSphere(config)).toBe(false);
  config.height = 8;
  config.surface = SURFACES.Rectangle;
  expect(errorSphere(config)).toBe(false);
});

test("dimensions error correctly", () => {
  const config = { ...DEFAULT_SETTINGS_CONFIG };
  config.height = 0;
  expect(errorHeight(config)).toBe(true);
  expect(errorConfig(config)).toBe(true);
  config.height = 1;
  expect(errorHeight(config)).toBe(true);
  config.height = 2;
  expect(errorHeight(config)).toBe(true);
  config.height = 3;
  expect(errorHeight(config)).toBe(false);
  expect(errorConfig(config)).toBe(false);
  config.height = 60;
  expect(errorHeight(config)).toBe(false);
  config.height = 61;
  expect(errorHeight(config)).toBe(true);
});

test("warning dimensions is correct & not a real error", () => {
  const config = { ...DEFAULT_SETTINGS_CONFIG };
  config.height = 3;
  config.width = 3;
  expect(warnDimensions(config)).toBe(true);
  expect(errorConfig(config)).toBe(false);
});

test("warning grid change is correct & not a real error", () => {
  const config = { ...DEFAULT_SETTINGS_CONFIG };
  config.height = 8;
  config.width = 10;
  expect(gridChangeNeeded(config, { height: 8, width: 8 })).toBe(true);
  expect(gridChangeNeeded(config, { height: 10, width: 10 })).toBe(true);
  expect(gridChangeNeeded(config, { height: 8, width: 10 })).toBe(false);
  expect(errorConfig(config)).toBe(false);
});

test("detecting duplicate keybinds correctly", () => {
  const hotkeyMap = cloneDeep(DEFAULT_HOTKEY_MAP);
  expect(duplicateKeybindsAtLetter(hotkeyMap, "ArrowUp")).toBe(false);
  hotkeyMap[0].keybind = "D";
  expect(duplicateKeybindsAtLetter(hotkeyMap, "D")).toBe(true);
  expect(duplicateKeybindsAtLetter(hotkeyMap, "ArrowUp")).toBe(false);
});
