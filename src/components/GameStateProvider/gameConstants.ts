export interface GamePreferences {
  showKeyboardIndicators: boolean;
  defaultRandomColors: boolean;
}

export const DEFAULT_GAME_PREFERENCES = {
  showKeyboardIndicators: false,
  defaultRandomColors: false,
  defaultAddTerrain: true,
};

export enum HotkeyableAction {
  ReflectY,
  ReflectX,
  RotateLeft,
  RotateRight,
  TilePrev,
  TileNext,
  GridUp,
  GridRight,
  GridDown,
  GridLeft,
  ClickBoard,
}

export type Hotkeys = Record<
  HotkeyableAction,
  {
    action: () => void;
    text: string;
  }
>;

export interface HotkeyMapEntry {
  keybind: string;
  action: HotkeyableAction;
}

export type HotkeyMap = HotkeyMapEntry[];

export const DEFAULT_HOTKEYS: Hotkeys = {
  [HotkeyableAction.ReflectY]: { action: () => {}, text: "" },
  [HotkeyableAction.ReflectX]: { action: () => {}, text: "" },
  [HotkeyableAction.RotateLeft]: { action: () => {}, text: "" },
  [HotkeyableAction.RotateRight]: { action: () => {}, text: "" },
  [HotkeyableAction.TilePrev]: { action: () => {}, text: "" },
  [HotkeyableAction.TileNext]: { action: () => {}, text: "" },
  [HotkeyableAction.GridUp]: { action: () => {}, text: "" },
  [HotkeyableAction.GridRight]: { action: () => {}, text: "" },
  [HotkeyableAction.GridDown]: { action: () => {}, text: "" },
  [HotkeyableAction.GridLeft]: { action: () => {}, text: "" },
  [HotkeyableAction.ClickBoard]: { action: () => {}, text: "" },
};

export const DEFAULT_HOTKEY_MAP: HotkeyMap = [
  { keybind: "A", action: HotkeyableAction.RotateLeft },
  { keybind: "D", action: HotkeyableAction.RotateRight },
  { keybind: "S", action: HotkeyableAction.ReflectX },
  { keybind: "W", action: HotkeyableAction.ReflectY },
  { keybind: "ArrowUp", action: HotkeyableAction.GridUp },
  { keybind: "ArrowDown", action: HotkeyableAction.GridDown },
  { keybind: "ArrowLeft", action: HotkeyableAction.GridLeft },
  { keybind: "ArrowRight", action: HotkeyableAction.GridRight },
  { keybind: "Enter", action: HotkeyableAction.ClickBoard },
  { keybind: "Q", action: HotkeyableAction.TilePrev },
  { keybind: "E", action: HotkeyableAction.TileNext },
];
