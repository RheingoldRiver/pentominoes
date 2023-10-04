import GameStateProvider from "../GameStateProvider/GameStateProvider";
import { Header } from "../Header/Header";
import GameToolbar from "../GameToolbar/GameToolbar";
import { Settings } from "../Settings/Settings";
import { Information } from "../Information/Information";
import AppStateProvider, { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { Board } from "../Board/Board";
import { useContext } from "react";
import clsx from "clsx";
import { DarkModeButton } from "../DarkModeButton/DarkModeButton";

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
  const { darkMode } = useContext(AppStateContext);
  //   console.log(darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={clsx("min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-50")}>
        <div
          className="grid py-4 w-full grid-cols-[auto_max-content_auto] "
          style={{
            gridTemplateAreas: `". header settings"". gameToolbar ." ". board ." "footer footer footer"`,
          }}
        >
          <Header style={{ gridArea: "header" }}></Header>
          <div
            className="flex flex-row items-start justify-end w-full h-full pr-2 gap-1"
            style={{ gridArea: "settings" }}
          >
            <DarkModeButton />
            <Information></Information>
            <Settings></Settings>
          </div>
          <GameToolbar style={{ gridArea: "gameToolbar" }}></GameToolbar>
          <Board gridArea="board"></Board>
        </div>
      </div>
    </div>
  );
};
