import { Board } from "../Board/Board";
import { Header } from "../Header/Header";
import GameToolbar from "../GameToolbar/GameToolbar";
import { Settings } from "../Settings/Settings";
import AppStateProvider from "../AppStateProvider/AppStateProvider";
import GameStateProvider from "../GameStateProvider/GameStateProvider";

export const Game = () => {
  return (
    <AppStateProvider>
      <GameStateProvider>
        <div className="min-h-screen bg-gray-50">
          <div
            className="grid py-4 w-full grid-cols-[auto_max-content_auto] "
            style={{
              gridTemplateAreas: `". header settings"". gameToolbar ." ". board ." "footer footer footer"`,
            }}
          >
            <Header style={{ gridArea: "header" }}></Header>
            <Settings style={{ gridArea: "settings" }}></Settings>
            <GameToolbar style={{ gridArea: "gameToolbar" }}></GameToolbar>
            <Board style={{ gridArea: "board" }}></Board>
          </div>
        </div>
      </GameStateProvider>
    </AppStateProvider>
  );
};
