import { useEffect } from "react";

function useHotkey(modifierKey: string | undefined, letterKey: string, action: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function doActionOnKeypress(e: KeyboardEvent) {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key.toLocaleLowerCase() !== letterKey.toLowerCase()) return;
      let doAction = modifierKey === undefined; // always do action if there's no modifier required
      if (modifierKey === "Control" && e.ctrlKey) {
        doAction = true;
      } else if (modifierKey === "Alt" && e.altKey) {
        doAction = true;
      } else if (modifierKey === "Shift") {
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
