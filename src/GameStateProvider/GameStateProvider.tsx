import { createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import { EMPTY_GRID, PlacedPentomino } from "../constants";
import { Coordinates, Pentomino, PENTOMINOES } from "../pentominoes";

interface GameState {
  grid: PlacedPentomino[][];
  setGrid: Dispatch<SetStateAction<PlacedPentomino[][]>>;
  currentPentomino: Pentomino;
  setCurrentPentomino: Dispatch<SetStateAction<Pentomino>>;
  toolbarPentomino: Pentomino;
  setToolbarPentomino: Dispatch<SetStateAction<Pentomino>>;
  currentGridCoords: Coordinates;
  setCurrentGridCoords: Dispatch<SetStateAction<Coordinates>>;
  currentReflection: number;
  setCurrentReflection: Dispatch<SetStateAction<number>>;
  currentRotation: number;
  setCurrentRotation: Dispatch<SetStateAction<number>>;
  drawPentomino: (newX: number, newY: number) => void;
  erasePentomino: (givenX: number, givenY: number) => void;
}

const DEFAULT_GAME_STATE: GameState = {
  grid: [],
  setGrid: () => {},
  currentPentomino: PENTOMINOES.None,
  setCurrentPentomino: () => {},
  toolbarPentomino: PENTOMINOES.None,
  setToolbarPentomino: () => {},
  currentGridCoords: { x: 0, y: 0 },
  setCurrentGridCoords: () => {},
  currentReflection: 0,
  setCurrentReflection: () => {},
  currentRotation: 0,
  setCurrentRotation: () => {},
  drawPentomino: () => {},
  erasePentomino: () => {},
};

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
  function erasePentomino(givenX: number, givenY: number) {
    const newGrid = grid.map((row, x) =>
      row.map((c, y) => {
        if (x === givenX && y === givenY) {
          return {
            pentomino: PENTOMINOES.None,
            reflection: 0,
            rotation: 0,
            x: x,
            y: y,
          };
        }
        return c;
      })
    );
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
        erasePentomino,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
