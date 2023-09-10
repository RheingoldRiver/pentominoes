import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Coordinates, EMPTY_GRID, PlacedPentomino } from "../constants";
import { Pentomino, PENTOMINOES } from "../pentominoes";

interface GameState {
  grid: PlacedPentomino[][];
  setGrid: Dispatch<SetStateAction<PlacedPentomino[][]>>;
  currentPentomino: Pentomino;
  setCurrentPentomino: Dispatch<SetStateAction<Pentomino>>;
  currentGridCoords: Coordinates;
  setCurrentGridCoords: Dispatch<SetStateAction<Coordinates>>;
  currentReflection: number;
  setCurrentReflection: Dispatch<SetStateAction<number>>;
  currentRotation: number;
  setCurrentRotation: Dispatch<SetStateAction<number>>;
  drawPentomino: Function;
}

export const DEFAULT_GAME_STATE: GameState = {
  grid: [],
  setGrid: () => {},
  currentPentomino: PENTOMINOES.None,
  setCurrentPentomino: () => {},
  currentGridCoords: { x: 0, y: 0 },
  setCurrentGridCoords: () => {},
  currentReflection: 0,
  setCurrentReflection: () => {},
  currentRotation: 0,
  setCurrentRotation: () => {},
  drawPentomino: () => {},
};

function transformShape(shape: number[][], reflection: number, rotation: number) {
  let newShape = [...shape];
  const numRows = shape.length;
  const numCols = shape[0].length;
  // reflection
  if (reflection === 1 || reflection == 3) {
    for (let i = 0; i < numRows; i++) {
      if (reflection === 3) {
        for (let j = 0; j < numCols; j++) {
          newShape[i][j] = shape[-1 * i][-1 * j];
        }
      } else {
        for (let j = 0; j < numCols; j++) {
          newShape[i][j] = shape[-1 * i][j];
        }
      }
    }
  }
  if (reflection === 2) {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        newShape[i][j] = shape[i][-1 * j];
      }
    }
  }
  // rotation
  if (rotation === 0) return newShape;
  newShape = newShape[0].map((_, i) => newShape.map((row) => row[i]).reverse());
  if (rotation === 1) {
    return newShape;
  }
  newShape = newShape[0].map((_, i) => newShape.map((row) => row[i]).reverse());
  if (rotation === 2) {
    return newShape;
  }
  newShape = newShape[0].map((_, i) => newShape.map((row) => row[i]).reverse());
  return newShape;
}

export const GameStateContext = createContext(DEFAULT_GAME_STATE);
export default function GameStateProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<PlacedPentomino[][]>(() => EMPTY_GRID);
  const [currentPentomino, setCurrentPentomino] = useState<Pentomino>(PENTOMINOES.None);
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
    // const newCurrentShape = transformShape(currentPentomino.shape, currentReflection, currentRotation);
    setGrid(newGrid);
  }

  return (
    <GameStateContext.Provider
      value={{
        grid,
        setGrid,
        currentPentomino,
        setCurrentPentomino,
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
