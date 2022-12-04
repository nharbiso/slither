import React, { useState } from "react";
import "./App.css";
import Game from "./game/Game";
import Home from "./home/Home";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState(new Map<string, number>());
  const [gameCode, setGameCode] = useState("ABCDEF");

  return (
    <div className="App">
      {gameStarted ? <Game scores={scores} setScores={setScores} gameCode={gameCode} setGameCode={setGameCode} /> : <Home setGameStarted={setGameStarted} setScores={setScores} setGameCode={setGameCode} />}
      {/* <Game /> */}
    </div>
  );
}

export default App;
