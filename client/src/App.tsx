import React, { useState } from "react";
import "./App.css";
import Game from "./game/Game";
import Home from "./home/Home";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState(new Map<string, number>());

  return (
    <div className="App">
      {gameStarted ? <Game scores={scores} setScores={setScores} /> : <Home setGameStarted={setGameStarted} setScores={setScores} />}
      {/* <Game /> */}
    </div>
  );
}

export default App;
