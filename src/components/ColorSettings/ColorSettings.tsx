import clsx from "clsx";
import { range } from "lodash";
import { useDrag, useDrop } from "react-dnd/dist/hooks";
import { Colors } from "../../constants";
import { PENTOMINOES } from "../../pentominoes";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";

const PENTOMINO_COLOR_DRAGGABLE_TYPE = "pcolor";

export const ColorSettings = ({
  displayColors,
  updateDisplayColors,
  pentominoColors,
  updatePentominoColors,
  numColors,
}: {
  displayColors: string[];
  updateDisplayColors: (newColors: string[]) => void;
  pentominoColors: Colors;
  updatePentominoColors: (newColors: Colors) => void;
  numColors: number;
}) => {
  return (
    <div
      className={"grid grid-flow-row mb-4 gap-y-4 gap-x-2"}
      style={{
        gridTemplateColumns: "auto 24em",
      }}
    >
      {range(numColors).map((x) => (
        <ColorSettingsRow
          key={`settings-color-${x}`}
          x={x}
          displayColors={displayColors}
          updateDisplayColors={updateDisplayColors}
          pentominoColors={pentominoColors}
          updatePentominoColors={updatePentominoColors}
        ></ColorSettingsRow>
      ))}
    </div>
  );
};

const ColorSettingsRow = ({
  x,
  displayColors,
  updateDisplayColors,
  pentominoColors,
  updatePentominoColors,
}: {
  x: number;
  displayColors: string[];
  updateDisplayColors: (newColors: string[]) => void;
  pentominoColors: Colors;
  updatePentominoColors: (newColors: Colors) => void;
}) => {
  const thisColorPentominoes = Object.entries(pentominoColors).reduce((acc: string[], [p, c]) => {
    if (c === x) return [...acc, p];
    return acc;
  }, []);

  const [{ isHovered }, dropRef] = useDrop(
    () => ({
      accept: PENTOMINO_COLOR_DRAGGABLE_TYPE,
      drop: ({ draggingPentomino }: { draggingPentomino: string }, monitor) => {
        if (monitor.didDrop()) return;
        updatePentominoColors({ ...pentominoColors, [draggingPentomino]: x });
      },
      collect: (monitor) => ({
        isHovered: !!monitor.isOver({ shallow: true }),
      }),
    }),
    [pentominoColors]
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
          value={displayColors[x]}
          pattern="[0-9]*"
          onChange={(e) => {
            const nextColors = [...displayColors];
            nextColors[x] = e.target.value;
            updateDisplayColors(nextColors);
          }}
        />
      </fieldset>
      <div
        ref={dropRef}
        className={clsx(
          "flex flex-row items-center flex-wrap p-2 border-slate-600 border border-solid rounded-md",
          isHovered ? "bg-emerald-200 dark:bg-emerald-900" : ""
        )}
      >
        {thisColorPentominoes.map((p) => (
          <ColorSettingsItem
            key={p}
            pentomino={p}
            color={pentominoColors[p]}
            pentominoColors={pentominoColors}
            updatePentominoColors={updatePentominoColors}
            displayColors={displayColors}
          ></ColorSettingsItem>
        ))}
      </div>
    </>
  );
};

const ColorSettingsItem = ({
  pentomino,
  color,
  pentominoColors,
  updatePentominoColors,
  displayColors,
}: {
  pentomino: string;
  color: number;
  pentominoColors: Colors;
  updatePentominoColors: (newColors: Colors) => void;
  displayColors: string[];
}) => {
  const [, dragRef] = useDrag(() => ({
    type: PENTOMINO_COLOR_DRAGGABLE_TYPE,
    item: { draggingPentomino: pentomino, prevColor: color },
  }));

  const [{ isHovered }, dropRef] = useDrop(
    () => ({
      accept: PENTOMINO_COLOR_DRAGGABLE_TYPE,
      drop: ({ draggingPentomino, prevColor }: { draggingPentomino: string; prevColor: number }) => {
        updatePentominoColors({ ...pentominoColors, [draggingPentomino]: color, [pentomino]: prevColor } as Colors);
      },
      collect: (monitor) => ({
        isHovered: !!monitor.isOver(),
      }),
    }),
    [pentominoColors]
  );

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={clsx("p-2 rounded-sm h-min cursor-grab", isHovered ? "bg-yellow-200 dark:bg-yellow-700" : "")}
    >
      <PentominoDisplay
        pentomino={PENTOMINOES[pentomino]}
        color={displayColors[color]}
        checkGrid={false}
      ></PentominoDisplay>
    </div>
  );
};
