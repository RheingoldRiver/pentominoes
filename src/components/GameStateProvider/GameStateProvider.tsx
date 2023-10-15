import { cloneDeep, debounce } from "lodash";
import { createContext, ReactNode, useState, Dispatch, SetStateAction, useRef, useEffect } from "react";
import {
  ALL_PENTOMINO_NAMES,
  Action,
  Colors,
  DEFAULT_CONFIG,
  PaintedCell,
  PlacedPentomino,
  SURFACES,
  Surface,
  UrlConfig,
} from "../../constants";
import { Coordinates, Pentomino, PENTOMINOES } from "../../pentominoes";
import { deserializeUrl, serializeUrl } from "./urlConfig";
import { useNavigate, useParams } from "react-router-dom";
import useHotkey from "../../hooks/use-hotkey";

interface GameState {
  grid: PlacedPentomino[][];
  setGrid: Dispatch<SetStateAction<PlacedPentomino[][]>>;
  currentPentomino: Pentomino;
  toolbarPentomino: Pentomino;
  currentGridCoords: Coordinates;
  currentReflection: number;
  currentRotation: number;
  rotateLeft: () => void;
  rotateRight: () => void;
  reflectX: () => void;
  reflectY: () => void;
  updateCurrentPentomino: (p: Pentomino) => void;
  clickBoard: (x: number, y: number, hasPentomino: boolean, cell: PaintedCell) => void;
  pentominoColors: Colors;
  setPentominoColors: Dispatch<SetStateAction<Colors>>;
  surface: Surface;
  setSurface: Dispatch<SetStateAction<Surface>>;
  clearGrid: (preserveTerrain: boolean) => void;
}

const DEFAULT_GAME_STATE: GameState = {
  grid: [],
  setGrid: () => {},
  currentPentomino: PENTOMINOES.None,
  toolbarPentomino: PENTOMINOES.None,
  currentGridCoords: { x: 0, y: 0 },
  currentReflection: 0,
  currentRotation: 0,
  rotateLeft: () => {},
  rotateRight: () => {},
  reflectX: () => {},
  reflectY: () => {},
  updateCurrentPentomino: () => {},
  clickBoard: () => {},
  pentominoColors: {},
  setPentominoColors: () => {},
  surface: SURFACES.Rectangle,
  setSurface: () => {},
  clearGrid: () => {},
};

export const GameStateContext = createContext(DEFAULT_GAME_STATE);
export default function GameStateProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const { config } = params;
  const parsedConfig = config ? deserializeUrl(config) : DEFAULT_CONFIG;

  const [grid, setGrid] = useState<PlacedPentomino[][]>(parsedConfig.grid);
  const [pentominoColors, setPentominoColors] = useState<Colors>(parsedConfig.colors);
  const [surface, setSurface] = useState<Surface>(parsedConfig.surface);

  const [currentPentomino, setCurrentPentomino] = useState<Pentomino>(PENTOMINOES.None);
  const [toolbarPentomino, setToolbarPentomino] = useState<Pentomino>(PENTOMINOES.None);
  const [currentGridCoords, setCurrentGridCoords] = useState<Coordinates>({ x: -1, y: -1 });
  const [currentReflection, setCurrentReflection] = useState<number>(0); // 0, 1
  const [currentRotation, setCurrentRotation] = useState<number>(0); // 0, 1, 2, 3

  const [actionHistory, setActionHistory] = useState<Action[]>([]);
  const navigate = useNavigate();

  const updateUrl = useRef(
    debounce((config: Partial<UrlConfig>) => {
      const finalConfig = {
        grid,
        surface,
        colors: pentominoColors,
        ...config,
      };
      const newHash = serializeUrl(finalConfig);
      if (`#/${newHash}` === window.location.hash) return;
      navigate("/" + newHash);
    }, 250)
  );

  useEffect(() => {
    updateUrl.current({ grid, colors: pentominoColors, surface });
  }, [grid, pentominoColors, surface]);

  useEffect(() => {
    window.addEventListener("hashchange", function () {
      window.location.reload();
    });
  });

  function rotateLeft() {
    setCurrentRotation((4 + currentRotation - 1) % 4);
  }

  function rotateRight() {
    setCurrentRotation((currentRotation + 1) % 4);
  }

  function reflectX() {
    if (currentRotation % 2 === 1) {
      setCurrentRotation((currentRotation + 2) % 4);
    }
    setCurrentReflection((currentReflection + 1) % 2);
  }

  function reflectY() {
    if (currentRotation % 2 === 0) {
      setCurrentRotation((currentRotation + 2) % 4);
    }
    setCurrentReflection((currentReflection + 1) % 2);
  }

  function resetOrientation() {
    setCurrentReflection(0);
    setCurrentRotation(0);
  }

  function updateCurrentPentomino(p: Pentomino) {
    setCurrentPentomino(p);
    setToolbarPentomino(p);
    resetOrientation();
  }

  useHotkey(undefined, "A", rotateLeft);
  useHotkey(undefined, "D", rotateRight);
  useHotkey(undefined, "S", reflectX);
  useHotkey(undefined, "W", reflectY);

  function updateToolbarPentomino(increment: number) {
    const curIndex = ALL_PENTOMINO_NAMES.indexOf(toolbarPentomino.name);
    const nextPentomino =
      toolbarPentomino.name === PENTOMINOES.None.name
        ? PENTOMINOES.R
        : PENTOMINOES[
            ALL_PENTOMINO_NAMES[(curIndex + increment + ALL_PENTOMINO_NAMES.length) % ALL_PENTOMINO_NAMES.length]
          ];
    setToolbarPentomino(nextPentomino);
    setCurrentPentomino(nextPentomino);
    resetOrientation();
  }

  useHotkey(undefined, "E", () => {
    console.log("not shift");
    updateToolbarPentomino(1);
  });

  useHotkey(undefined, "Q", () => {
    updateToolbarPentomino(-1);
  });

  function updateGridCoords(dim: keyof Coordinates, dir: number) {
    console.log(currentGridCoords);
    if (currentGridCoords.x === -1 && currentGridCoords.y === -1) {
      setCurrentGridCoords({ x: 0, y: 0 });
      return;
    }
    const newCoords = { ...currentGridCoords };
    const length = dim === "x" ? grid.length : grid[0].length;
    newCoords[dim] = (currentGridCoords[dim] + dir + length) % length;
    setCurrentGridCoords(newCoords);
  }

  useHotkey(undefined, "ArrowLeft", () => {
    updateGridCoords("y", -1);
  });

  useHotkey(undefined, "ArrowUp", () => {
    updateGridCoords("x", -1);
  });

  useHotkey(undefined, "ArrowRight", () => {
    updateGridCoords("y", 1);
  });

  useHotkey(undefined, "ArrowDown", () => {
    updateGridCoords("x", 1);
  });

  useHotkey("Control", "Z", () => {
    const nextActionHistory = [...actionHistory];
    const lastAction = nextActionHistory.pop();
    if (lastAction === undefined) return;
    const nextGrid = cloneDeep(grid);
    lastAction.pentominoes.forEach((p) => {
      nextGrid[p.x][p.y].pentomino = PENTOMINOES[p.prevName];
      nextGrid[p.x][p.y].rotation = p.prevRotation;
      nextGrid[p.x][p.y].reflection = p.prevReflection;
    });
    setGrid(nextGrid);
    setActionHistory(nextActionHistory);
  });

  function recordActionHistory(x: number, y: number) {
    const nextActionHistory = [
      ...actionHistory,
      {
        pentominoes: [
          {
            // grid not nextGrid
            prevName: grid[x][y].pentomino.name,
            prevRotation: grid[x][y].rotation,
            prevReflection: grid[x][y].reflection,
            x: x,
            y: y,
          },
        ],
      },
    ];

    setActionHistory(nextActionHistory);
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

  function clearGrid(preserveTerrain: boolean) {
    const nextAction: Action = { pentominoes: [] };
    const nextGrid = grid.map((row, x) =>
      row.map((c, y) => {
        if (
          !(c.pentomino.name === PENTOMINOES.None.name || (preserveTerrain && c.pentomino.name === PENTOMINOES.R.name))
        ) {
          nextAction.pentominoes.push({
            prevName: c.pentomino.name,
            prevReflection: c.reflection,
            prevRotation: c.rotation,
            x,
            y,
          });
        }
        return {
          ...c,
          pentomino: preserveTerrain && c.pentomino.name === PENTOMINOES.R.name ? PENTOMINOES.R : PENTOMINOES.None,
        };
      })
    );
    setActionHistory([...actionHistory, nextAction]);
    setGrid(nextGrid);
  }

  function clickBoard(x: number, y: number, hasPentomino: boolean, cell: PaintedCell) {
    setCurrentGridCoords({ x: x, y: y });
    if (hasPentomino === false) {
      drawPentomino(x, y);
    } else {
      setCurrentPentomino(cell.pentomino.pentomino);
      setToolbarPentomino(cell.pentomino.pentomino);
      erasePentomino(cell.pentomino.x, cell.pentomino.y);
      setCurrentRotation(cell.pentomino.rotation);
      setCurrentReflection(cell.pentomino.reflection);
    }
  }

  return (
    <GameStateContext.Provider
      value={{
        grid,
        setGrid,
        currentPentomino,
        toolbarPentomino,
        currentGridCoords,
        currentReflection,
        currentRotation,
        rotateLeft,
        rotateRight,
        reflectX,
        reflectY,
        updateCurrentPentomino,
        clickBoard,
        pentominoColors,
        setPentominoColors,
        surface,
        setSurface,
        clearGrid,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
