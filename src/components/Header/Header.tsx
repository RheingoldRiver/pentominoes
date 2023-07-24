import clsx from "clsx";
import { Pentomino } from "../Pentomino/Pentomino";

export const Header = () => {
  return (
    <div className={clsx("flex items-center gap-4")}>
      <Pentomino letter="P"></Pentomino>
      <Pentomino letter="I"></Pentomino>
      <Pentomino letter="F"></Pentomino>
    </div>
  );
};
