import { HotkeyMap } from "./gameConstants";

const OUTER_SEP = ";;;";
const INNER_SEP = ":::";

export const serializeHotkeys = (hotkeyMap: HotkeyMap): string => {
  return hotkeyMap.map((key) => `${key.action}${INNER_SEP}${key.keybind}`).join(OUTER_SEP);
};

export const deserializeHotkeys = (val: string): HotkeyMap => {
  const t = val.split(OUTER_SEP);
  return t.map((s) => {
    const [a, k] = s.split(INNER_SEP);
    return {
      action: parseInt(a),
      keybind: k,
    };
  });
};
