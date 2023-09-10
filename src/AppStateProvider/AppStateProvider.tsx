import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface AppState {
  pentominoSize: number;
  setPentominoSize: Dispatch<SetStateAction<number>>;
}

const DEFAULT_APP_STATE: AppState = {
  pentominoSize: 0,
  setPentominoSize: () => {},
};

export const AppStateContext = createContext(DEFAULT_APP_STATE);
export default function AppStateProvider({ children }: { children: ReactNode }) {
  const [pentominoSize, setPentominoSize] = useState<number>(8);
  return <AppStateContext.Provider value={{ pentominoSize, setPentominoSize }}>{children}</AppStateContext.Provider>;
}
