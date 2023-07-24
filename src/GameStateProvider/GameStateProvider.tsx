import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { EMPTY_GRID } from "../constants";

interface GameState {
  grid: (string | undefined)[][];
  setGrid: Dispatch<SetStateAction<(string | undefined)[][]>>;
}

export const DEFAULT_GAME_STATE: GameState = {
  grid: [],
  setGrid: () => {},
};

export const GameStateContext = createContext(DEFAULT_GAME_STATE);
export default function GameStateProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<(string | undefined)[][]>(() => EMPTY_GRID);
  return <GameStateContext.Provider value={{ grid, setGrid }}>{children}</GameStateContext.Provider>;
}
