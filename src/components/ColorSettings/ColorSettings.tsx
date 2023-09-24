import { range } from "lodash";
import { Dispatch, SetStateAction } from "react";
import { useDrag, useDrop } from "react-dnd/dist/hooks";
import { Colors } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";

const PENTOMINO_COLOR_DRAGGABLE_TYPE = "pcolor";

interface DropResult {
  newColor: string;
}

export const ColorSettings = ({
  curDColors,
  setCurDColors,
  curPColors,
  setCurPColors,
  curNumColors,
}: {
  curDColors: string[];
  setCurDColors: Dispatch<SetStateAction<string[]>>;
  curPColors: Colors;
  setCurPColors: Dispatch<SetStateAction<Colors>>;
  curNumColors: number;
}) => {
  return (
    <div
      className={"grid grid-flow-row mb-4 gap-y-4 gap-x-2"}
      style={{
        gridTemplateColumns: "auto 24em",
      }}
    >
      {range(curNumColors).map((x) => (
        <ColorSettingsRow
          key={`settings-color-${x}`}
          x={x}
          curDColors={curDColors}
          setCurDColors={setCurDColors}
          curPColors={curPColors}
          setCurPColors={setCurPColors}
        ></ColorSettingsRow>
      ))}
    </div>
  );
};

const ColorSettingsRow = ({
  x,
  curDColors,
  setCurDColors,
  curPColors,
  setCurPColors,
}: {
  x: number;
  curDColors: string[];
  setCurDColors: Dispatch<SetStateAction<string[]>>;
  curPColors: Colors;
  setCurPColors: Dispatch<SetStateAction<Colors>>;
}) => {
  const thisColorPentominoes = Object.entries(curPColors).reduce((acc: string[], [p, c]) => {
    if (c === x) return [...acc, p];
    return acc;
  }, []);

  const [, dropRef] = useDrop(() => ({
    accept: PENTOMINO_COLOR_DRAGGABLE_TYPE,
    drop: () => {
      return { newColor: x };
    },
  }));

  return (
    <>
      <fieldset className="flex gap-4 items-center4">
        <label className="text-right whitespace-nowrap" htmlFor={`colorNum${x}`}>
          Color {x + 1}
        </label>
        <input
          type="color"
          id={`colorNum${x}`}
          value={curDColors[x]}
          pattern="[0-9]*"
          onChange={(e) => {
            const nextColors = [...curDColors];
            nextColors[x] = e.target.value;
            setCurDColors(nextColors);
          }}
        />
      </fieldset>
      <div ref={dropRef} className="flex flex-row flex-wrap gap-2 p-2 border-slate-600 border border-solid rounded-md">
        {thisColorPentominoes.map((p) => (
          <ColorSettingsItem
            key={p}
            pentomino={p}
            curPColors={curPColors}
            setCurPColors={setCurPColors}
          ></ColorSettingsItem>
        ))}
      </div>
    </>
  );
};

const ColorSettingsItem = ({
  pentomino,
  curPColors,
  setCurPColors,
}: {
  pentomino: string;
  curPColors: Colors;
  setCurPColors: Dispatch<SetStateAction<Colors>>;
}) => {
  const [, dragRef] = useDrag(() => ({
    type: PENTOMINO_COLOR_DRAGGABLE_TYPE,
    item: { pentomino },
    end: (_item, monitor) => {
      const dropResult = monitor.getDropResult() as DropResult;
      if (!dropResult) {
        return;
      }
      console.log(pentomino);
      const nextColors = { ...curPColors, [pentomino]: dropResult.newColor as unknown as number };
      console.log(nextColors);
      setCurPColors(nextColors);
    },
  }));

  return (
    <div ref={dragRef}>
      <PentominoDisplay pentomino={PENTOMINOES[pentomino]}></PentominoDisplay>
    </div>
  );
};
