// App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import GameControls from "./components/GameControls";
import Game from "./components/Game";

const App = () => (
  <GameProvider>
    <Router>
      <Routes>
        <Route path="/" element={<GameControls />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  </GameProvider>
);

export default App;
