import GameStateProvider from "../GameStateProvider/GameStateProvider";
import { Header } from "../Header/Header";
import TopToolbar from "../TopToolbar/TopToolbar";
import { Settings } from "../Settings/Settings";
import { Information } from "../Information/Information";
import AppStateProvider from "../AppStateProvider/AppStateProvider";
import { Board } from "../Board/Board";
import { DarkModeButton } from "../DarkModeButton/DarkModeButton";
import clsx from "clsx";
import { Wordmark } from "../Wordmark/Wordmark";
import BottomToolbar from "../BottomToolbar/BottomToolbar";
import { useRef } from "react";

export const Game = () => {
  return (
    <AppStateProvider>
      <GameStateProvider>
        <GameContent />
      </GameStateProvider>
    </AppStateProvider>
  );
};

const GameContent = () => {
  const screenshotRef = useRef();
  return (
    <div
      className={clsx(
        "min-h-screen grid py-4 w-full grid-areas-game xl:grid-areas-gamexl 2xl:grid-areas-game2xl",
        "bg-gray-50 dark:bg-gray-950 dark:text-gray-50",
        "grid-rows-game 2xl:grid-rows-game2xl grid-cols-game"
      )}
    >
      <Wordmark gridArea="wordmark" />
      <Header style={{ gridArea: "header" }}></Header>
      <div
        className="flex flex-row items-start justify-end w-full h-full pr-2 gap-2 max-w-[100vw]"
        style={{ gridArea: "settings" }}
      >
        <Settings></Settings>
        <DarkModeButton />
        <Information></Information>
      </div>
      <TopToolbar style={{ gridArea: "gameToolbar" }}></TopToolbar>
      <Board gridArea="board" ref={screenshotRef}></Board>
      <BottomToolbar style={{ gridArea: "botToolbar" }} ref={screenshotRef} />
    </div>
  );
};
