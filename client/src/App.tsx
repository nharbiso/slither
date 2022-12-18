import Denque from "denque";
import { useState } from "react";

import "./App.css";

import GameState, { Position } from "./game/GameState";
import Game from "./game/Game";
import { OrbData } from "./game/orb/Orb";
import { SnakeData, SNAKE_VELOCITY } from "./game/snake/Snake";
import Home from "./home/Home";

/**
 * Creates and returns the overarching HTML element representing the Slither+ 
 * app at any given moment, appropriately either the home or in-game screen
 * @returns the overarching HTML SLither+ app element
 */
export default function App(): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState(new Map<string, number>());
  const [gameCode, setGameCode] = useState("");

  const orbSet = new Set<OrbData>();
  
  // initial snake
  const snakeBody: Position[] = [];
  for(let i = 0; i < 20; i++) {
    snakeBody.push({ x: 0, y: 5 * i });
  }
  const snake: SnakeData = {
    snakeBody: new Denque(snakeBody),
    velocityX: 0,
    velocityY: SNAKE_VELOCITY,
  };

  const [gameState, setGameState] = useState<GameState>({
    snakes: new Map([["user1", snake]]),
    otherBodies: new Set<string>([]),
    orbs: orbSet,
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
          gameCode={gameCode}
        />
      ) : (
        <Home
          setGameStarted={setGameStarted}
          setScores={setScores}
          setGameCode={setGameCode}
          gameState={gameState}
          setGameState={setGameState}
          orbSet={orbSet}
        />
      )}
    </div>
  );
}
