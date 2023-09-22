import { createContext, ReactNode, useState } from "react";
import { DEFAULT_DISPLAY_COLORS } from "../../constants";

interface AppState {
  pentominoSize: number;
  updatePentominoSize: (x: number) => void;
  displayColors: string[];
  updateDisplayColors: (x: string[]) => void;
  numVisibleColors: number;
  updateNumVisibleColors: (x: number) => void;
}

const DEFAULT_APP_STATE: AppState = {
  pentominoSize: 0,
  updatePentominoSize: () => {},
  displayColors: [],
  updateDisplayColors: () => {},
  numVisibleColors: 0,
  updateNumVisibleColors: () => {},
};

export const AppStateContext = createContext(DEFAULT_APP_STATE);
export default function AppStateProvider({ children }: { children: ReactNode }) {
  const [pentominoSize, setPentominoSize] = useState<number>(() => {
    return Number(window.localStorage.getItem("size") ?? 12);
  });
  const [displayColors, setDisplayColors] = useState<string[]>(() => {
    const localVal = window.localStorage.getItem("colors");
    if (typeof localVal === "string") return localVal.split(",");
    return DEFAULT_DISPLAY_COLORS;
  });
  const [numVisibleColors, setNumVisibleColors] = useState(() => {
    return Number(window.localStorage.getItem("numColors") ?? 1);
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

  return (
    <AppStateContext.Provider
      value={{
        pentominoSize,
        updatePentominoSize,
        displayColors,
        updateDisplayColors,
        numVisibleColors,
        updateNumVisibleColors,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
