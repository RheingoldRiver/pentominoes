import { cloneDeep, debounce } from "lodash";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useMemo,
  Reducer,
  useReducer,
} from "react";
import {
  ALL_PENTOMINO_NAMES,
  Action,
  Colors,
  DEFAULT_GAME_CONFIG,
  Orientation,
  PENTOMINO_NAMES,
  PaintedCell,
  PlacedPentomino,
  SURFACES,
  Surface,
  UrlConfig,
  randomPentominoColors,
} from "../../constants";
import { Coordinates, Pentomino, PENTOMINOES } from "../../pentominoes";
import { deserializeUrl, serializeUrl } from "./urlConfig";
import { useNavigate, useParams } from "react-router-dom";
import useHotkey from "../../hooks/use-hotkey";
import { getPaintedBoard } from "./paintGrid";
import {
  OrientationAction,
  OrientationActionType,
  ReflectionDirection,
  RotationDirection,
  orientationReducer,
} from "./currentPentominoReducer";
import { DEFAULT_GAME_PREFERENCES } from "./gameConstants";

interface GameState {
  grid: PlacedPentomino[][];
  setGrid: Dispatch<SetStateAction<PlacedPentomino[][]>>;
  paintedGrid: PaintedCell[][];
  currentPentomino: Pentomino;
  currentGridCoords: Coordinates;
  currentOrientation: Orientation;
  orientationDispatch: Dispatch<OrientationAction>;
  updateCurrentPentomino: (p: Pentomino) => void;
  clickBoard: (x: number, y: number) => void;
  hoverBoard: (x: number, y: number) => void;
  unhoverBoard: () => void;
  pentominoColors: Colors;
  setPentominoColors: Dispatch<SetStateAction<Colors>>;
  surface: Surface;
  setSurface: Dispatch<SetStateAction<Surface>>;
  clearGrid: (preserveTerrain: boolean) => void;
  showKeyboardIndicators: boolean;
  setShowKeyboardIndicators: Dispatch<SetStateAction<boolean>>;
  showInvalidUrlError: boolean;
  setShowInvalidUrlError: Dispatch<SetStateAction<boolean>>;
  defaultRandomColors: boolean;
  updateDefaultRandomColors: (newDefault: boolean) => void;
}

const DEFAULT_GAME_STATE: GameState = {
  grid: [],
  setGrid: () => {},
  paintedGrid: [],
  currentPentomino: PENTOMINOES.None,
  currentGridCoords: { x: 0, y: 0 },
  currentOrientation: { reflection: 0, rotation: 0 },
  orientationDispatch: () => {},
  updateCurrentPentomino: () => {},
  clickBoard: () => {},
  hoverBoard: () => {},
  unhoverBoard: () => {},
  pentominoColors: {},
  setPentominoColors: () => {},
  surface: SURFACES.Rectangle,
  setSurface: () => {},
  clearGrid: () => {},
  showKeyboardIndicators: false,
  setShowKeyboardIndicators: () => {},
  showInvalidUrlError: false,
  setShowInvalidUrlError: () => {},
  defaultRandomColors: false,
  updateDefaultRandomColors: () => {},
};

export const GameStateContext = createContext(DEFAULT_GAME_STATE);
export default function GameStateProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<PlacedPentomino[][]>(DEFAULT_GAME_CONFIG.grid);
  const [pentominoColors, setPentominoColors] = useState<Colors>(DEFAULT_GAME_CONFIG.colors);
  const [surface, setSurface] = useState<Surface>(DEFAULT_GAME_CONFIG.surface);

  const [defaultRandomColors, setDefaultRandomColors] = useState<boolean>(() => {
    return (
      (window.localStorage.getItem("randc") || DEFAULT_GAME_PREFERENCES.showKeyboardIndicators.toString()) === "true"
    );
  });

  const [showInvalidUrlError, setShowInvalidUrlError] = useState<boolean>(false);
  const params = useParams();
  const { config } = params;

  useEffect(() => {
    if (!config) {
      if (defaultRandomColors) setPentominoColors(randomPentominoColors(PENTOMINO_NAMES.length));
      return;
    }
    try {
      const parsedConfig = deserializeUrl(config, defaultRandomColors);
      setGrid(parsedConfig.grid);
      setSurface(parsedConfig.surface);
      setPentominoColors(parsedConfig.colors);
    } catch (e) {
      setShowInvalidUrlError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentPentomino, setCurrentPentomino] = useState<Pentomino>(PENTOMINOES.None);
  const [currentGridCoords, setCurrentGridCoords] = useState<Coordinates>({ x: -1, y: -1 });
  const [currentOrientation, orientationDispatch] = useReducer<Reducer<Orientation, OrientationAction>>(
    orientationReducer,
    { reflection: 0, rotation: 0 }
  );

  const [actionHistory, setActionHistory] = useState<Action[]>([]);
  const navigate = useNavigate();

  const [showKeyboardIndicators, setShowKeyboardIndicators] = useState<boolean>(
    DEFAULT_GAME_PREFERENCES.showKeyboardIndicators
  );
  const [boardHovered, setBoardHovered] = useState<boolean>(false);

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

  const paintedGrid = useMemo(() => {
    return getPaintedBoard(
      grid,
      surface,
      {
        pentomino: currentPentomino,
        orientation: { ...currentOrientation },
        coordinates: { ...currentGridCoords },
      },
      boardHovered
    );
  }, [grid, surface, currentGridCoords, boardHovered, currentPentomino, currentOrientation]);

  function updateCurrentPentomino(p: Pentomino) {
    setCurrentPentomino(p);
    orientationDispatch({ type: OrientationActionType.replace });
  }

  function updateGridCoords(dim: keyof Coordinates, dir: number) {
    if (currentGridCoords.x === -1 && currentGridCoords.y === -1) {
      setCurrentGridCoords({ x: 0, y: 0 });
      return;
    }
    const newCoords = { ...currentGridCoords };
    const length = dim === "x" ? grid.length : grid[0].length;
    newCoords[dim] = (currentGridCoords[dim] + dir + length) % length;
    setCurrentGridCoords(newCoords);
  }

  function recordActionHistory(x: number, y: number) {
    const nextActionHistory = [
      ...actionHistory,
      {
        pentominoes: [
          {
            // grid not nextGrid
            prevName: grid[x][y].pentomino.name,
            prevOrientation: { ...grid[x][y].orientation },
            prevCoordinates: { x, y },
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
      orientation: { ...currentOrientation },
      coordinates: { x: newX, y: newY },
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
            orientation: {
              reflection: 0,
              rotation: 0,
            },
            coordinates: { x, y },
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
            prevOrientation: { ...c.orientation },
            prevCoordinates: { x, y },
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

  function clickBoard(x: number, y: number) {
    setCurrentGridCoords({ x: x, y: y });
    const cell = paintedGrid[x][y];
    if (cell.pentomino.pentomino.name === PENTOMINOES.None.name || cell.hovered) {
      drawPentomino(x, y);
    } else {
      setCurrentPentomino(cell.pentomino.pentomino);
      erasePentomino(cell.pentomino.coordinates.x, cell.pentomino.coordinates.y);
      orientationDispatch({
        type: OrientationActionType.replace,
        newOrientation: cell.pentomino.orientation,
      });
    }
  }

  function hoverBoard(x: number, y: number) {
    setBoardHovered(true);
    setCurrentGridCoords({ x, y });
  }

  function unhoverBoard() {
    setBoardHovered(false);
  }

  const updateDefaultRandomColors = (newDefault: boolean) => {
    window.localStorage.setItem("randc", newDefault.toString());
    setDefaultRandomColors(newDefault);
  };

  useHotkey("Control", "Z", () => {
    const nextActionHistory = [...actionHistory];
    const lastAction = nextActionHistory.pop();
    if (lastAction === undefined) return;
    const nextGrid = cloneDeep(grid);
    lastAction.pentominoes.forEach((p) => {
      nextGrid[p.prevCoordinates.x][p.prevCoordinates.y].pentomino = PENTOMINOES[p.prevName];
      nextGrid[p.prevCoordinates.x][p.prevCoordinates.y].orientation = { ...p.prevOrientation };
    });
    setGrid(nextGrid);
    setActionHistory(nextActionHistory);
  });

  useHotkey(undefined, "ArrowLeft", () => {
    setShowKeyboardIndicators(true);
    updateGridCoords("y", -1);
  });

  useHotkey(undefined, "ArrowUp", () => {
    setShowKeyboardIndicators(true);
    updateGridCoords("x", -1);
  });

  useHotkey(undefined, "ArrowRight", () => {
    setShowKeyboardIndicators(true);
    updateGridCoords("y", 1);
  });

  useHotkey(undefined, "ArrowDown", () => {
    setShowKeyboardIndicators(true);
    updateGridCoords("x", 1);
  });

  useHotkey(undefined, "A", () => {
    orientationDispatch({ type: OrientationActionType.rotate, direction: RotationDirection.Left });
  });
  useHotkey(undefined, "D", () => {
    orientationDispatch({ type: OrientationActionType.rotate, direction: RotationDirection.Right });
  });
  useHotkey(undefined, "S", () => {
    orientationDispatch({ type: OrientationActionType.reflect, direction: ReflectionDirection.X });
  });
  useHotkey(undefined, "W", () => {
    orientationDispatch({ type: OrientationActionType.reflect, direction: ReflectionDirection.Y });
  });

  function updateToolbarPentomino(increment: number) {
    const curIndex = ALL_PENTOMINO_NAMES.indexOf(currentPentomino.name);
    const nextPentomino =
      currentPentomino.name === PENTOMINOES.None.name
        ? PENTOMINOES.R
        : PENTOMINOES[
            ALL_PENTOMINO_NAMES[(curIndex + increment + ALL_PENTOMINO_NAMES.length) % ALL_PENTOMINO_NAMES.length]
          ];
    setCurrentPentomino(nextPentomino);
    orientationDispatch({ type: OrientationActionType.replace });
  }

  useHotkey(undefined, "E", () => {
    setShowKeyboardIndicators(true);
    updateToolbarPentomino(1);
  });

  useHotkey(undefined, "Q", () => {
    setShowKeyboardIndicators(true);
    updateToolbarPentomino(-1);
  });

  useHotkey(undefined, "Enter", () => {
    clickBoard(currentGridCoords.x, currentGridCoords.y);
  });

  return (
    <GameStateContext.Provider
      value={{
        grid,
        setGrid,
        paintedGrid,
        currentPentomino,
        currentGridCoords,
        currentOrientation,
        orientationDispatch,
        updateCurrentPentomino,
        clickBoard,
        hoverBoard,
        unhoverBoard,
        pentominoColors,
        setPentominoColors,
        surface,
        setSurface,
        clearGrid,
        showKeyboardIndicators,
        setShowKeyboardIndicators,
        showInvalidUrlError,
        setShowInvalidUrlError,
        defaultRandomColors,
        updateDefaultRandomColors,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
