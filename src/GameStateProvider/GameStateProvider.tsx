import { createContext, ReactNode, useState } from "react";
import { EMPTY_GRID, PlacedPentomino } from "../constants";
import { Coordinates, Pentomino, PENTOMINOES } from "../pentominoes";
import { DEFAULT_GAME_STATE } from "./gameStateConstants";

export const GameStateContext = createContext(DEFAULT_GAME_STATE);
export default function GameStateProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<PlacedPentomino[][]>(() => EMPTY_GRID);
  const [currentPentomino, setCurrentPentomino] = useState<Pentomino>(PENTOMINOES.None);
  const [toolbarPentomino, setToolbarPentomino] = useState<Pentomino>(PENTOMINOES.None);
  const [currentGridCoords, setCurrentGridCoords] = useState<Coordinates>({ x: 0, y: 0 });
  const [currentReflection, setCurrentReflection] = useState<number>(0); // 0, 1, 2, 3: 0, x, y, both
  const [currentRotation, setCurrentRotation] = useState<number>(0); // 0, 1, 2, 3

  function drawPentomino(newX: number, newY: number) {
    const newGrid = [...grid];
    newGrid[newX][newY] = {
      pentomino: currentPentomino,
      reflection: currentReflection,
      rotation: currentRotation,
      x: newX,
      y: newY,
    };
    setGrid(newGrid);
  }

  return (
    <GameStateContext.Provider
      value={{
        grid,
        setGrid,
        currentPentomino,
        setCurrentPentomino,
        toolbarPentomino,
        setToolbarPentomino,
        currentGridCoords,
        setCurrentGridCoords,
        currentReflection,
        setCurrentReflection,
        currentRotation,
        setCurrentRotation,
        drawPentomino,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
