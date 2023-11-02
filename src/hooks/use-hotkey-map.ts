import { Hotkeys, HotkeyMap, HotkeyableAction } from "./../components/GameStateProvider/gameConstants";
import { useEffect } from "react";

interface HotkeyLookup {
  [key: string]: HotkeyableAction;
}

function useHotkeyMap(hotkeyMap: HotkeyMap, hotkeys: Hotkeys) {
  useEffect(() => {
    const hotkeyLookup = hotkeyMap.reduce((acc: HotkeyLookup, key) => {
      acc[key.keybind.toLocaleLowerCase()] = key.action;
      return acc;
    }, {});
    function doActionOnKeypress(e: KeyboardEvent) {
      if (e.isComposing || e.keyCode === 229) return;
      if (hotkeyLookup[e.key.toLocaleLowerCase()] === undefined) return;
      e.preventDefault();
      e.stopPropagation();
      hotkeys[hotkeyLookup[e.key.toLocaleLowerCase()]].action();
    }

    window.addEventListener("keydown", doActionOnKeypress);
    return () => {
      window.removeEventListener("keydown", doActionOnKeypress);
    };
  }, [hotkeyMap, hotkeys]);
}

export default useHotkeyMap;
