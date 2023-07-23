import { useState } from "react";
import "./App.css";
import { Pentomino } from "./components/Pentomino/Pentomino";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Pentomino letter="P"></Pentomino>
      <br />
      <Pentomino letter="I"></Pentomino>
      <br />
      <Pentomino letter="F"></Pentomino>
    </>
  );
}

export default App;
