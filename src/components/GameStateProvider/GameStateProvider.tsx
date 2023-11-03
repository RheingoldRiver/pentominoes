import { cloneDeep, debounce, range } from "lodash";
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
  Dimensions,
  EMPTY_PENTOMINO,
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
import {
  DEFAULT_GAME_PREFERENCES,
  DEFAULT_HOTKEYS,
  DEFAULT_HOTKEY_MAP,
  HotkeyMap,
  HotkeyableAction,
  Hotkeys,
} from "./gameConstants";
import { produce } from "immer";
import useHotkeyMap from "../../hooks/use-hotkey-map";
import { deserializeHotkeys, serializeHotkeys } from "./hotkeyMapState";

interface GameState {
  grid: PlacedPentomino[][];
  newGrid: (nextGrid: PlacedPentomino[][]) => boolean;
  resetGrid: (dimensions: Dimensions) => void;
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
  defaultAddTerrain: boolean;
  updateDefaultAddTerrain: (newDefault: boolean) => void;
  hotkeys: Hotkeys;
  hotkeyMap: HotkeyMap;
  updateHotkeyMap: (nextMap: HotkeyMap) => void;
}

const DEFAULT_GAME_STATE: GameState = {
  grid: [],
  newGrid: () => {
    return true;
  },
  resetGrid: () => {},
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
  defaultAddTerrain: true,
  updateDefaultAddTerrain: () => {},
  hotkeys: DEFAULT_HOTKEYS,
  hotkeyMap: [],
  updateHotkeyMap: () => {},
};

export const GameStateContext = createContext(DEFAULT_GAME_STATE);
export default function GameStateProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<PlacedPentomino[][]>(DEFAULT_GAME_CONFIG.grid);
  const [pentominoColors, setPentominoColors] = useState<Colors>(DEFAULT_GAME_CONFIG.colors);
  const [surface, setSurface] = useState<Surface>(DEFAULT_GAME_CONFIG.surface);

  const [defaultRandomColors, setDefaultRandomColors] = useState<boolean>(() => {
    return (
      (window.localStorage.getItem("randc") ?? DEFAULT_GAME_PREFERENCES.showKeyboardIndicators.toString()) === "true"
    );
  });
  const [defaultAddTerrain, setDefaultAddTerrain] = useState<boolean>(() => {
    return (
      (window.localStorage.getItem("initterrain") ?? DEFAULT_GAME_PREFERENCES.defaultAddTerrain.toString()) === "true"
    );
  });

  const [showInvalidUrlError, setShowInvalidUrlError] = useState<boolean>(false);
  const params = useParams();
  const { config } = params;

  useEffect(() => {
    if (!config) {
      if (defaultRandomColors) setPentominoColors(randomPentominoColors(PENTOMINO_NAMES.length));
      if (defaultAddTerrain) {
        setGrid(
          produce(grid, (draftGrid) => {
            draftGrid[0][0].pentomino = PENTOMINOES.R;
            draftGrid[0][7].pentomino = PENTOMINOES.R;
            draftGrid[7][0].pentomino = PENTOMINOES.R;
            draftGrid[7][7].pentomino = PENTOMINOES.R;
          })
        );
      }
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
    setGrid(
      produce(grid, (draftGrid) => {
        draftGrid[newX][newY] = {
          pentomino: currentPentomino,
          orientation: { ...currentOrientation },
          coordinates: { x: newX, y: newY },
        };
      })
    );
  }
  function erasePentomino(givenX: number, givenY: number) {
    recordActionHistory(givenX, givenY);
    setGrid(
      produce(grid, (draftGrid) => {
        draftGrid[givenX][givenY].pentomino = PENTOMINOES.None;
      })
    );
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

  function resetGrid(dimensions: Dimensions) {
    setGrid(
      range(dimensions.height).map((x) =>
        range(dimensions.width).map((y) => {
          return EMPTY_PENTOMINO(x, y);
        })
      )
    );
  }

  function newGrid(nextGrid: PlacedPentomino[][]): boolean {
    let gridIsEmpty = true;
    // check against the grid from game state
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell.pentomino.name !== PENTOMINOES.None.name) gridIsEmpty = false;
      })
    );
    if (gridIsEmpty || confirm("Reset your board? You won't be able to undo.")) {
      setGrid(nextGrid);
      return true;
    }
    return false;
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

  const updateDefaultAddTerrain = (newDefault: boolean) => {
    window.localStorage.setItem("initterrain", newDefault.toString());
    setDefaultAddTerrain(newDefault);
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

  const [hotkeyMap, setHotkeyMap] = useState<HotkeyMap>(() => {
    const cachedData = window.localStorage.getItem("hotkeys");
    if (!cachedData) return cloneDeep(DEFAULT_HOTKEY_MAP);
    return deserializeHotkeys(cachedData);
  });

  const updateHotkeyMap = (nextMap: HotkeyMap) => {
    setHotkeyMap(nextMap);
    window.localStorage.setItem("hotkeys", serializeHotkeys(nextMap));
  };

  const hotkeys = {
    [HotkeyableAction.ReflectY]: {
      action: () => {
        orientationDispatch({ type: OrientationActionType.reflect, direction: ReflectionDirection.Y });
      },
      text: "Reflect horizontally",
    },
    [HotkeyableAction.ReflectX]: {
      action: () => {
        orientationDispatch({ type: OrientationActionType.reflect, direction: ReflectionDirection.X });
      },
      text: "Reflect vertically",
    },
    [HotkeyableAction.RotateLeft]: {
      action: () => {
        orientationDispatch({ type: OrientationActionType.rotate, direction: RotationDirection.Left });
      },
      text: "Rotate left (counter-clockwise)",
    },
    [HotkeyableAction.RotateRight]: {
      action: () => {
        orientationDispatch({ type: OrientationActionType.rotate, direction: RotationDirection.Right });
      },
      text: "Rotate right (clockwise)",
    },
    [HotkeyableAction.TilePrev]: {
      action: () => {
        setShowKeyboardIndicators(true);
        updateToolbarPentomino(-1);
      },
      text: "Select previous tile",
    },
    [HotkeyableAction.TileNext]: {
      action: () => {
        setShowKeyboardIndicators(true);
        updateToolbarPentomino(1);
      },
      text: "Select next tile",
    },
    [HotkeyableAction.ClickBoard]: {
      action: () => {
        clickBoard(currentGridCoords.x, currentGridCoords.y);
      },
      text: "Place or remove tile",
    },
    [HotkeyableAction.GridUp]: {
      action: () => {
        setShowKeyboardIndicators(true);
        updateGridCoords("x", -1);
      },
      text: "Move grid cursor up",
    },
    [HotkeyableAction.GridRight]: {
      action: () => {
        setShowKeyboardIndicators(true);
        updateGridCoords("y", 1);
      },
      text: "Move grid cursor right",
    },
    [HotkeyableAction.GridDown]: {
      action: () => {
        setShowKeyboardIndicators(true);
        updateGridCoords("x", 1);
      },
      text: "Move grid cursor down",
    },
    [HotkeyableAction.GridLeft]: {
      action: () => {
        setShowKeyboardIndicators(true);
        updateGridCoords("y", -1);
      },
      text: "Move grid cursor left",
    },
  };

  useHotkeyMap(hotkeyMap, hotkeys);

  return (
    <GameStateContext.Provider
      value={{
        grid,
        newGrid,
        resetGrid,
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
        defaultAddTerrain,
        updateDefaultAddTerrain,
        hotkeys,
        hotkeyMap,
        updateHotkeyMap,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}
