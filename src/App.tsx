import { Game } from "./components/Game/Game";
import { HashRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Game />} />
        <Route path=":config" element={<Game />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
