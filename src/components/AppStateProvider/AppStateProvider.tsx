import { createContext, ReactNode, useState } from "react";
import { DEFAULT_DISPLAY_COLORS } from "../../constants";

interface AppState {
  pentominoSize: number;
  updatePentominoSize: (x: number) => void;
  displayColors: string[];
  updateDisplayColors: (x: string[]) => void;
  numVisibleColors: number;
  updateNumVisibleColors: (x: number) => void;
  darkMode: boolean;
  updateDarkMode: (x: boolean) => void;
}

const DEFAULT_APP_STATE: AppState = {
  pentominoSize: 0,
  updatePentominoSize: () => {},
  displayColors: [],
  updateDisplayColors: () => {},
  numVisibleColors: 0,
  updateNumVisibleColors: () => {},
  darkMode: false,
  updateDarkMode: () => {},
};

export const AppStateContext = createContext(DEFAULT_APP_STATE);

export default function AppStateProvider({ children }: { children: ReactNode }) {
  const [pentominoSize, setPentominoSize] = useState<number>(() => {
    return Number(window.localStorage.getItem("size") ?? 12);
  });
  const [displayColors, setDisplayColors] = useState<string[]>(() => {
    const localVal = window.localStorage.getItem("colors");
    if (typeof localVal !== "string") return DEFAULT_DISPLAY_COLORS;
    const nextColors = [...DEFAULT_DISPLAY_COLORS];
    localVal.split(",").forEach((c, i) => (nextColors[i] = c));
    return nextColors;
  });
  const [numVisibleColors, setNumVisibleColors] = useState<number>(() => {
    return Number(window.localStorage.getItem("numColors") ?? 3);
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (window.localStorage.getItem("theme") || "light") !== "light";
  });

  function updatePentominoSize(newSize: number) {
    setPentominoSize(newSize);
    window.localStorage.setItem("size", newSize.toString());
  }

  function updateDisplayColors(newColors: string[]) {
    setDisplayColors(newColors);
    window.localStorage.setItem("colors", newColors.join(","));
  }

  function updateNumVisibleColors(newNum: number) {
    setNumVisibleColors(newNum);
    window.localStorage.setItem("numColors", newNum.toString());
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
        pentominoSize,
        updatePentominoSize,
        displayColors,
        updateDisplayColors,
        numVisibleColors,
        updateNumVisibleColors,
        darkMode,
        updateDarkMode,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
