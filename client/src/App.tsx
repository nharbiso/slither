import Denque from "denque";
import React, { useState } from "react";
import "./App.css";
import Game from "./game/Game";
import GameState, { Position } from "./game/GameState";
import { OrbData } from "./game/orb/Orb";
import OrbSize from "./game/orb/orbSize";
import { SnakeData, SNAKE_VELOCITY } from "./game/snake/Snake";
import Home from "./home/Home";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState(new Map<string, number>());
  const [gameCode, setGameCode] = useState("");

  const snakeBody: Position[] = [];
  for (let i = 0; i < 100; i++) {
    snakeBody.push({ x: 600, y: 100 + 5 * i });
  }
  const snake: SnakeData = {
    snakeBody: new Denque(snakeBody),
    velocityX: 0,
    velocityY: SNAKE_VELOCITY,
  };

  const orbPosition: Position = {
    x: 100,
    y: 500,
  };
  const orb: OrbData = { position: orbPosition, size: OrbSize.LARGE };

  const [gameState, setGameState] = useState<GameState>({
    snakes: new Map([["user1", snake]]),
    otherBodies: new Set(),
    orbs: new Set([orb]),
    scores: new Map([["user1", 0]]),
    gameCode: "abc",
  });

  return (
    <div className="App">
      {gameStarted ? (
        <Game
          gameState={gameState}
          setGameState={setGameState}
          scores={scores}
          setScores={setScores}
          gameCode={gameCode}
          setGameCode={setGameCode}
        />
      ) : (
        <Home
          setGameStarted={setGameStarted}
          setScores={setScores}
          setGameCode={setGameCode}
          gameState={gameState}
          setGameState={setGameState}
        />
      )}
      {/* <Game /> */}
    </div>
  );
}

export default App;
