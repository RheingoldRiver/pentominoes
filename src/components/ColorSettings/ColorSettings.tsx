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

  const [, dropRef] = useDrop(
    () => ({
      accept: PENTOMINO_COLOR_DRAGGABLE_TYPE,
      drop: ({ pentomino }: { pentomino: string }) => {
        setCurPColors({ ...curPColors, [pentomino]: x });
      },
    }),
    [curPColors]
  );

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
          <ColorSettingsItem key={p} pentomino={p} displayColor={curDColors[curPColors[p]]}></ColorSettingsItem>
        ))}
      </div>
    </>
  );
};

const ColorSettingsItem = ({ pentomino, displayColor }: { pentomino: string; displayColor: string }) => {
  const [, dragRef] = useDrag(() => ({
    type: PENTOMINO_COLOR_DRAGGABLE_TYPE,
    item: { pentomino },
  }));

  return (
    <div ref={dragRef}>
      <PentominoDisplay pentomino={PENTOMINOES[pentomino]} color={displayColor} checkGrid={false}></PentominoDisplay>
    </div>
  );
};
