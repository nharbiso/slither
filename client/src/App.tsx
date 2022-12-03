import React, { useState } from "react";
import "./App.css";
import Game from "./game/Game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="App">
        <Game />
    </div>
  );
}

export default App;
