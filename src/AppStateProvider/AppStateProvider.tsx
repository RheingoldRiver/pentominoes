import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface AppState {
  pentominoSize: number;
  setPentominoSize: Dispatch<SetStateAction<number>>;
  gridWidth: number;
  setGridWidth: Dispatch<SetStateAction<number>>;
  gridHeight: number;
  setGridHeight: Dispatch<SetStateAction<number>>;
}

const DEFAULT_APP_STATE: AppState = {
  pentominoSize: 0,
  setPentominoSize: () => {},
  gridWidth: 0,
  setGridWidth: () => {},
  gridHeight: 0,
  setGridHeight: () => {},
};

export const AppStateContext = createContext(DEFAULT_APP_STATE);
export default function AppStateProvider({ children }: { children: ReactNode }) {
  const [pentominoSize, setPentominoSize] = useState<number>(8);
  const [gridWidth, setGridWidth] = useState<number>(8);
  const [gridHeight, setGridHeight] = useState<number>(8);
  return (
    <AppStateContext.Provider
      value={{ pentominoSize, setPentominoSize, gridWidth, setGridWidth, gridHeight, setGridHeight }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
