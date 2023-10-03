import { Header } from "../Header/Header";
import GameToolbar from "../GameToolbar/GameToolbar";
import { Settings } from "../Settings/Settings";
import GameStateProvider from "../GameStateProvider/GameStateProvider";
import { Information } from "../Information/Information";
import AppStateProvider from "../AppStateProvider/AppStateProvider";
import { Board } from "../Board/Board";

export const Game = () => {
  return (
    <AppStateProvider>
      <GameStateProvider>
        <div className="min-h-screen bg-gray-50">
          <GameContent />
        </div>
      </GameStateProvider>
    </AppStateProvider>
  );
};

const GameContent = () => {
  return (
    <div
      className="grid py-4 w-full grid-cols-[auto_max-content_auto] "
      style={{
        gridTemplateAreas: `". header settings"". gameToolbar ." ". board ." "footer footer footer"`,
      }}
    >
      <Header style={{ gridArea: "header" }}></Header>
      <div className="flex flex-row items-start justify-end w-full h-full pr-2 gap-1" style={{ gridArea: "settings" }}>
        <Information></Information>
        <Settings></Settings>
      </div>
      <GameToolbar style={{ gridArea: "gameToolbar" }}></GameToolbar>
      <Board gridArea="board"></Board>
    </div>
  );
};
