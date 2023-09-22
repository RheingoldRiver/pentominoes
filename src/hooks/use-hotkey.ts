import { useEffect } from "react";

function useHotkey(modifierKey: string, letterKey: string, action: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function doActionOnKeypress(e: KeyboardEvent) {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key !== letterKey.toLowerCase()) return;
      let doAction = false;
      if (modifierKey === "Control" && e.ctrlKey) {
        doAction = true;
      } else if (modifierKey === "Alt" && e.altKey) {
        doAction = true;
      }
      if (!doAction) return;
      action(e);
    }

    window.addEventListener("keydown", doActionOnKeypress);
    return () => {
      window.removeEventListener("keydown", doActionOnKeypress);
    };
  }, [letterKey, action, modifierKey]);
}

export default useHotkey;
