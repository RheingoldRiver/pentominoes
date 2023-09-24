import { Game } from "./components/Game/Game";
import { HashRouter, Route, Routes } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <HashRouter>
        <Routes>
          <Route index element={<Game />} />
          <Route path=":config" element={<Game />} />
        </Routes>
      </HashRouter>
    </DndProvider>
  );
}

export default App;
