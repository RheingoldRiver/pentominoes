import { DEFAULT_DISPLAY_COLORS } from "../../constants";

export interface AppPreferences {
  pentominoSize: number;
  displayColors: string[];
  numVisibleColors: number;
  copyImage: boolean;
  showCdot: boolean;
}

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  pentominoSize: 12,
  displayColors: DEFAULT_DISPLAY_COLORS,
  numVisibleColors: 3,
  copyImage: false,
  showCdot: false,
};
