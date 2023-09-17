import "./App.css";
import AppStateProvider from "./AppStateProvider/AppStateProvider";
import { Game } from "./components/Game/Game";
import GameStateProvider from "./GameStateProvider/GameStateProvider";

function App() {
  return (
    <AppStateProvider>
      <GameStateProvider>
        <Game></Game>
      </GameStateProvider>
    </AppStateProvider>
  );
}

export default App;
