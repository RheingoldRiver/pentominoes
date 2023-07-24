import "./App.css";
import AppStateProvider from "./AppStateProvider/AppStateProvider";
import { Pentomino } from "./components/Pentomino/Pentomino";

function App() {
  return (
    <AppStateProvider>
      <Pentomino letter="P"></Pentomino>
      <br />
      <Pentomino letter="I"></Pentomino>
      <br />
      <Pentomino letter="F"></Pentomino>
    </AppStateProvider>
  );
}

export default App;
