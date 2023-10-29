import { DEFAULT_COLORS, DEFAULT_GAME_CONFIG } from "./../../constants";
import { DEFAULT_APP_PREFERENCES } from "./../AppStateProvider/appConstants";
import { Colors, Surface } from "../../constants";
import { DEFAULT_GAME_PREFERENCES } from "../GameStateProvider/gameConstants";

export interface CurrentState {
  pentominoSize: number;
  height: number;
  width: number;
  numVisibleColors: number;
  displayColors: string[];
  pentominoColors: Colors;
  surface: Surface;
  showKeyboardIndicators: boolean;
  copyImage: boolean;
  showCdot: boolean;
  defaultRandomColors: boolean;
  defaultAddTerrain: boolean;
}

export const DEFAULT_SETTINGS_CONFIG: CurrentState = {
  ...DEFAULT_APP_PREFERENCES,
  ...DEFAULT_GAME_PREFERENCES,
  ...DEFAULT_GAME_CONFIG,
  height: DEFAULT_GAME_CONFIG.grid.length,
  width: DEFAULT_GAME_CONFIG.grid[0].length,
  pentominoColors: DEFAULT_COLORS,
};
