import { Board } from "../Board/Board";
import { Header } from "../Header/Header";
import GameToolbar from "../GameToolbar/GameToolbar";
import { Settings } from "../../Settings/Settings";

export const Game = () => {
  return (
    <div className="min-h-screen bg-gray-100">
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
  );
};
