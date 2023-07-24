import "./App.css";
import AppStateProvider from "./AppStateProvider/AppStateProvider";
import { Board } from "./components/Board/Board";
import { Header } from "./components/Header/Header";
import GameStateProvider from "./GameStateProvider/GameStateProvider";

function App() {
  return (
    <AppStateProvider>
      <GameStateProvider>
        <Header></Header>
        <Board></Board>
      </GameStateProvider>
    </AppStateProvider>
  );
}

export default App;
