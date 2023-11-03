import { createContext, ReactNode, useState } from "react";
import { DEFAULT_DISPLAY_COLORS } from "../../constants";
import { AppPreferences, DEFAULT_APP_PREFERENCES } from "./appConstants";

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
  settingsOpen: boolean;
  setSettingsOpen: (newVal: boolean) => void;
}

const DEFAULT_APP_STATE: AppState = {
  appPreferences: DEFAULT_APP_PREFERENCES,
  updateAppPreferences: () => {},
  darkMode: false,
  updateDarkMode: () => {},
  settingsOpen: false,
  setSettingsOpen: () => {},
};

export const AppStateContext = createContext(DEFAULT_APP_STATE);

export default function AppStateProvider({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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
      copyImage: (window.localStorage.getItem("copy") || "false") === "true",
      showCdot: (window.localStorage.getItem("cdot") || "false") === "true",
    };
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme !== undefined) {
      return storedTheme === "dark";
    }
    return !!window.matchMedia("(prefers-color-scheme: dark)").matches;
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
        settingsOpen,
        setSettingsOpen,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
