import { useContext } from "react";
import { GameStateContext } from "../GameStateProvider/GameStateProvider";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { PentominoDisplay } from "../PentominoDisplay/PentominoDisplay";
import { PENTOMINOES } from "../../pentominoes";
import clsx from "clsx";

interface TypographyPentomino {
  pentomino: string;
  reflection: number;
  class?: string;
}

const pentominoesTitle: TypographyPentomino[] = [
  {
    pentomino: "P",
    reflection: 0,
  },
  {
    pentomino: "W",
    reflection: 0,
    class: "rotate-45",
  },
  {
    pentomino: "N",
    reflection: 0,
    class: "w-6 md:w-10 rotate-[205deg]",
  },
  {
    pentomino: "T",
    reflection: 0,
  },
  {
    pentomino: "P",
    reflection: 1,
    class: "w-7 md:w-12 rotate-[315deg]",
  },
  {
    pentomino: "W",
    reflection: 0,
    class: "w-6 md:w-10 rotate-[135deg]",
  },
  {
    pentomino: "I",
    reflection: 0,
    class: "scale-75",
  },
  {
    pentomino: "N",
    reflection: 0,
    class: "w-6 md:w-10 rotate-[205deg]",
  },
  {
    pentomino: "P",
    reflection: 1,
    class: "w-7 md:w-12 rotate-[315deg]",
  },
  {
    pentomino: "W",
    reflection: 0,
    class: "rotate-45",
  },
  {
    pentomino: "Z",
    reflection: 1,
    class: "rotate-[-35deg]",
  },
];

export const Wordmark = ({ gridArea }: { gridArea: string }) => {
  const { pentominoColors } = useContext(GameStateContext);
  const { displayColors } = useContext(AppStateContext);

  return (
    <div className={clsx("ml-16 flex flex-row gap-1 items-center mb-2")} style={{ gridArea }}>
      {pentominoesTitle.map((p) => (
        <div
          className={clsx(p.class, "flex items-center justify-center")}
          style={{
            transform: `rotate(${p.cssRotation}deg)`,
          }}
        >
          <PentominoDisplay
            pentomino={PENTOMINOES[p.pentomino]}
            color={displayColors[pentominoColors[p.pentomino]]}
            reflection={p.reflection}
            checkGrid={false}
            size={2}
            showCenter={false}
          />
        </div>
      ))}
    </div>
  );
};
