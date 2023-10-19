import { createContext, ReactNode, useState } from "react";
import { DEFAULT_DISPLAY_COLORS } from "../../constants";

export interface AppPreferences {
  pentominoSize: number;
  displayColors: string[];
  numVisibleColors: number;
  copyImage: boolean;
  showCdot: boolean;
}

const DEFAULT_APP_PREFERENCES: AppPreferences = {
  pentominoSize: 12,
  displayColors: DEFAULT_DISPLAY_COLORS,
  numVisibleColors: 3,
  copyImage: false,
  showCdot: false,
};

interface AppState {
  appPreferences: AppPreferences;
  updateAppPreferences: (
    pentominoSize: number,
    displayColors: string[],
    numVisibleColors: number,
    copyImage: boolean,
    showCdot: boolean
  ) => void;
  darkMode: boolean;
  updateDarkMode: (newIsDark: boolean) => void;
}

const DEFAULT_APP_STATE: AppState = {
  appPreferences: DEFAULT_APP_PREFERENCES,
  updateAppPreferences: () => {},
  darkMode: false,
  updateDarkMode: () => {},
};

export const AppStateContext = createContext(DEFAULT_APP_STATE);

export default function AppStateProvider({ children }: { children: ReactNode }) {
  const [appPreferences, setAppPreferences] = useState<AppPreferences>(() => {
    const localColors = window.localStorage.getItem("colors");
    const displayColors = [...DEFAULT_DISPLAY_COLORS];
    if (typeof localColors === "string") {
      localColors.split(",").forEach((c, i) => (displayColors[i] = c));
    }
    return {
      pentominoSize: Number(window.localStorage.getItem("size") ?? DEFAULT_APP_PREFERENCES.pentominoSize),
      displayColors: displayColors,
      numVisibleColors: Number(window.localStorage.getItem("numColors") ?? DEFAULT_APP_PREFERENCES.numVisibleColors),
      copyImage: (window.localStorage.getItem("theme") || "light") !== "light",
      showCdot: (window.localStorage.getItem("cdot") || "false") === "true",
    };
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (window.localStorage.getItem("copy") || "false") === "true";
  });

  function updateAppPreferences(
    pentominoSize: number,
    displayColors: string[],
    numVisibleColors: number,
    copyImage: boolean,
    showCdot: boolean
  ) {
    setAppPreferences({ pentominoSize, displayColors, numVisibleColors, copyImage, showCdot });
    window.localStorage.setItem("size", pentominoSize.toString());
    window.localStorage.setItem("colors", displayColors.join(","));
    window.localStorage.setItem("numColors", numVisibleColors.toString());
    window.localStorage.setItem("copy", copyImage.toString());
    window.localStorage.setItem("cdot", showCdot.toString());
  }

  function updateDarkMode(newIsDark: boolean) {
    if (newIsDark === true) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkMode(newIsDark);
    window.localStorage.setItem("theme", newIsDark ? "dark" : "light");
  }

  return (
    <AppStateContext.Provider
      value={{
        appPreferences,
        updateAppPreferences,
        darkMode,
        updateDarkMode,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
