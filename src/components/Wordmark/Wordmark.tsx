import { useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";
import { Coordinates, PENTOMINOES } from "../../pentominoes";
import clsx from "clsx";

interface TypographyPentomino {
  pentomino: string;
  reflection: number;
  class?: string;
  removeEdges?: Coordinates[];
}

interface PentominoLetters {
  [key: string]: TypographyPentomino;
}
const pentominoLetters: PentominoLetters = {
  P: {
    pentomino: "P",
    reflection: 0,
    class: "rotate-[1deg]",
  },
  E: {
    pentomino: "W",
    reflection: 0,
    class: "rotate-45 scale-[80%] ml-[-0.25rem] mr-[-0.5rem]",
  },
  N: {
    pentomino: "N",
    reflection: 0,
    class: "w-6 md:w-10 rotate-[220deg]",
  },
  T: {
    pentomino: "T",
    reflection: 0,
    class: "rotate-[1deg]",
  },
  O: {
    pentomino: "P",
    reflection: 1,
    class: "w-7 md:w-12 rotate-[315deg]",
    removeEdges: [{ x: 0, y: 0 }],
  },
  M: {
    pentomino: "W",
    reflection: 0,
    class: "w-6 md:w-10 rotate-[135deg] translate-y-[20%]",
  },
  I: {
    pentomino: "I",
    reflection: 0,
    class: "scale-75 rotate-[1deg]",
  },
  S: {
    pentomino: "Z",
    reflection: 1,
    class: "rotate-[-35deg] scale-90 ml-[-0.5rem]",
  },
};

const pentominoesTitle: TypographyPentomino[] = "PENTOMINOES"
  .split("")
  .map((l) => pentominoLetters[l as keyof typeof pentominoLetters]);

export const Wordmark = ({ gridArea }: { gridArea: string }) => {
  const { pentominoColors, showInvalidUrlError, setShowInvalidUrlError } = useContext(GameStateContext);
  const { appPreferences } = useContext(AppStateContext);

  return (
    <div className="ml-16" style={{ gridArea }}>
      <div className={clsx("flex flex-row gap-2 items-center mb-2")}>
        {pentominoesTitle.map((p, i) => (
          <div key={i} className={clsx(p.class, "flex items-center justify-center")}>
            <PentominoDisplay
              pentomino={PENTOMINOES[p.pentomino]}
              color={appPreferences.displayColors[pentominoColors[p.pentomino]]}
              orientation={{ rotation: 0, reflection: p.reflection }}
              checkGrid={false}
              size={2}
              showCenter={false}
              removeEdges={p.removeEdges}
            />
          </div>
        ))}
      </div>
      {showInvalidUrlError && (
        <div className={clsx("text-red-500 mb-2 flex flex-row gap-3")}>
          Invalid URL. Default settings have been applied.
          <button
            className="cursor-pointer font-bold"
            onClick={() => {
              setShowInvalidUrlError(false);
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};
