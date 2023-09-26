import clsx from "clsx";
import { range } from "lodash";
import { Dispatch, SetStateAction } from "react";
import { useDrag, useDrop } from "react-dnd/dist/hooks";
import { Colors } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";

const PENTOMINO_COLOR_DRAGGABLE_TYPE = "pcolor";

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

  const [{ isHovered }, dropRef] = useDrop(
    () => ({
      accept: PENTOMINO_COLOR_DRAGGABLE_TYPE,
      drop: ({ draggingPentomino }: { draggingPentomino: string }, monitor) => {
        if (monitor.didDrop()) return;
        setCurPColors({ ...curPColors, [draggingPentomino]: x });
      },
      collect: (monitor) => ({
        isHovered: !!monitor.isOver({ shallow: true }),
      }),
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
      <div
        ref={dropRef}
        className={clsx(
          "flex flex-row items-center flex-wrap p-2 border-slate-600 border border-solid rounded-md",
          isHovered ? "bg-emerald-200" : ""
        )}
      >
        {thisColorPentominoes.map((p) => (
          <ColorSettingsItem
            key={p}
            pentomino={p}
            color={curPColors[p]}
            curPColors={curPColors}
            setCurPColors={setCurPColors}
            curDColors={curDColors}
          ></ColorSettingsItem>
        ))}
      </div>
    </>
  );
};

const ColorSettingsItem = ({
  pentomino,
  color,
  curPColors,
  setCurPColors,
  curDColors,
}: {
  pentomino: string;
  color: number;
  curPColors: Colors;
  setCurPColors: Dispatch<SetStateAction<Colors>>;
  curDColors: string[];
}) => {
  const [, dragRef] = useDrag(() => ({
    type: PENTOMINO_COLOR_DRAGGABLE_TYPE,
    item: { draggingPentomino: pentomino, prevColor: color },
  }));

  const [{ isHovered }, dropRef] = useDrop(
    () => ({
      accept: PENTOMINO_COLOR_DRAGGABLE_TYPE,
      drop: ({ draggingPentomino, prevColor }: { draggingPentomino: string; prevColor: number }) => {
        setCurPColors({ ...curPColors, [draggingPentomino]: color, [pentomino]: prevColor } as Colors);
      },
      collect: (monitor) => ({
        isHovered: !!monitor.isOver(),
      }),
    }),
    [curPColors]
  );

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={clsx("p-2 rounded-sm h-min", isHovered ? "bg-yellow-200" : "")}
    >
      <PentominoDisplay
        pentomino={PENTOMINOES[pentomino]}
        color={curDColors[color]}
        checkGrid={false}
      ></PentominoDisplay>
    </div>
  );
};
