import { cloneDeep, debounce } from "lodash";
import { createContext, ReactNode, useState, Dispatch, SetStateAction, useRef, useEffect } from "react";
import { Action, Colors, DEFAULT_CONFIG, PlacedPentomino, UrlConfig } from "../../constants";
import { Coordinates, Pentomino, PENTOMINOES } from "../../pentominoes";
import { deserializeUrl, serializeUrl } from "./urlConfig";
import { useNavigate, useParams } from "react-router-dom";
import useHotkey from "../../hooks/use-hotkey";

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
  pentominoColors: Colors;
  setPentominoColors: Dispatch<SetStateAction<Colors>>;
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
  pentominoColors: {},
  setPentominoColors: () => {},
};

export const GameStateContext = createContext(DEFAULT_GAME_STATE);
export default function GameStateProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const { config } = params;
  const parsedConfig = config ? deserializeUrl(config) : DEFAULT_CONFIG;

  const [grid, setGrid] = useState<PlacedPentomino[][]>(parsedConfig.grid);
  const [pentominoColors, setPentominoColors] = useState<Colors>(parsedConfig.colors);

  const [currentPentomino, setCurrentPentomino] = useState<Pentomino>(PENTOMINOES.None);
  const [toolbarPentomino, setToolbarPentomino] = useState<Pentomino>(PENTOMINOES.None);
  const [currentGridCoords, setCurrentGridCoords] = useState<Coordinates>({ x: 0, y: 0 });
  const [currentReflection, setCurrentReflection] = useState<number>(0); // 0, 1
  const [currentRotation, setCurrentRotation] = useState<number>(0); // 0, 1, 2, 3

  const [actionHistory, setActionHistory] = useState<Action[]>([]);

  const navigate = useNavigate();
  const updateUrl = useRef(
    debounce((config: Partial<UrlConfig>) => {
      const finalConfig = {
        grid: grid,
        colors: pentominoColors,
        ...config,
      };
      navigate("/" + serializeUrl(finalConfig));
    }, 250)
  );

  useEffect(() => {
    updateUrl.current({ grid: grid, colors: pentominoColors });
  }, [grid, pentominoColors]);

  useEffect(() => {
    window.addEventListener("hashchange", function () {
      window.location.reload();
    });
  });

  useHotkey("Control", "Z", () => {
    const nextActionHistory = [...actionHistory];
    const lastAction = nextActionHistory.pop();
    if (lastAction === undefined) return;
    const nextGrid = cloneDeep(grid);
    nextGrid[lastAction.x][lastAction.y].pentomino = PENTOMINOES[lastAction.prevName];
    nextGrid[lastAction.x][lastAction.y].rotation = lastAction.prevRotation;
    nextGrid[lastAction.x][lastAction.y].reflection = lastAction.prevReflection;
    setGrid(nextGrid);
    setActionHistory(nextActionHistory);
  });

  function recordActionHistory(x: number, y: number) {
    const nextActionHistory = [
      ...actionHistory,
      {
        // grid not nextGrid
        prevName: grid[x][y].pentomino.name,
        prevRotation: grid[x][y].rotation,
        prevReflection: grid[x][y].reflection,
        x: x,
        y: y,
      },
    ];

    setActionHistory(nextActionHistory);

    console.log(nextActionHistory);
  }

  function drawPentomino(newX: number, newY: number) {
    recordActionHistory(newX, newY);
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
    recordActionHistory(givenX, givenY);
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
        pentominoColors,
        setPentominoColors,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
