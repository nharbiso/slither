import Denque from "denque";
import GameState, { Position } from "./GameState";
import OrbSize from "./orb/orbSize";
import { OrbData } from "./orb/Orb";
import { SnakeData, SNAKE_VELOCITY } from "./snake/Snake";
import React, { useState, useEffect } from "react";

import GameCanvas from "./GameCanvas";
import MessageType from "../message/messageTypes";
import {
  leaderboardData,
  leaderboardEntry,
  sendNewClientNoCodeMessage,
  sendNewClientWithCodeMessage,
  UpdatePositionMessage,
} from "../message/message";
import Leaderboard from "../leaderboard/Leaderboard";
import GameCode from "../gameCode/GameCode";

const AppConfig = {
  PROTOCOL: "ws:",
  HOST: "localhost",
  PORT: ":9000",
};

// let toregister: boolean = true;
let socket: WebSocket;

export function registerSocket(
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  setGameCode: React.Dispatch<React.SetStateAction<string>>,
  setOrbSet: React.Dispatch<React.SetStateAction<Set<OrbData>>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  username: string,
  hasGameCode: boolean,
  gameCode: string = ""
) {
  socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT);
  // socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST);

  socket.onopen = () => {
    console.log("client: A new client-side socket was opened!");
    // TODO: random string username for now; pass user chosen username later); also pass chosen game code later
    // sendNewClientNoCodeMessage(socket, (Math.random() * 1000).toString());
    if (hasGameCode) {
      sendNewClientWithCodeMessage(socket, username, gameCode);
    } else {
      sendNewClientNoCodeMessage(socket, username);
    }
  };

  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
    // ideally, we would want to do different things based on the message's type
    console.log("client: A message was received: " + response.data);
    switch (message.type) {
      case MessageType.JOIN_SUCCESS: {
        setGameStarted(true);
        break;
      }
      case MessageType.JOIN_ERROR: {
        setErrorText("Error: Failed to join the game!");
        setGameStarted(false); // shouldn't be required; just putting it here to be safe
        break;
      }
      case MessageType.UPDATE_POSITION: {
        console.log("UPDATE POSITION MESSAGE");
        const updatePositionMessage: UpdatePositionMessage = message;
        const toAdd: Position = updatePositionMessage.data.add;
        const toRemove: Position = updatePositionMessage.data.remove;
        // const newOtherBodies = gameState.otherBodies;
        const newGameState: GameState = { ...gameState };
        console.log(gameState.otherBodies);
        console.log(gameState.otherBodies.entries);
        console.log(JSON.stringify(toRemove));
        console.log("gameState otherbodies: " + gameState.otherBodies.size);
        // newOtherBodies.delete(JSON.stringify(toRemove));
        newGameState.otherBodies.delete(JSON.stringify(toRemove));
        console.log(
          "gameState otherbodies after delete: " + gameState.otherBodies.size
        );
        // newOtherBodies.add(JSON.stringify(toAdd));
        newGameState.otherBodies.add(JSON.stringify(toAdd));
        console.log(
          "gameState otherbodies after add: " + gameState.otherBodies.size
        );
        // setGameState({
        //   snakes: gameState.snakes,
        //   otherBodies: newOtherBodies,
        //   orbs: gameState.orbs,
        //   scores: gameState.scores,
        //   gameCode: gameState.gameCode,
        // });
        setGameState(newGameState);
        break;
      }
      case MessageType.UPDATE_LEADERBOARD: {
        const leaderboardMessage: leaderboardData = message;
        setScores(extractLeaderboardMap(leaderboardMessage.data.leaderboard));
        break;
      }
      case MessageType.SET_GAME_CODE: {
        setGameCode(message.data.gameCode);
        break;
      }
      case MessageType.SEND_ORBS: {
        setOrbSet(message.data.orbSet);
        break;
      }
    }

    // case MessageType.SET_CODE: {

    // }
  };
}

interface GameProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  scores: Map<string, number>;
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  gameCode: string;
  setGameCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function Game({
  gameState,
  setGameState,
  scores,
  setScores,
  gameCode,
  setGameCode,
}: GameProps) {
  // const snakeBody: Position[] = [];
  // for (let i = 0; i < 100; i++) {
  //   snakeBody.push({ x: 600, y: 100 + 5 * i });
  // }
  // const snake: SnakeData = {
  //   snakeBody: new Denque(snakeBody),
  //   velocityX: 0,
  //   velocityY: SNAKE_VELOCITY,
  // };

  // const [scores, setScores] = useState(new Map<string, number>());

  // useEffect(() => {
  //   if (!toregister) {
  //     return;
  //   }
  //   toregister = false;
  //   registerSocket(setScores);
  // }, []);

  const [snakes, setSnakes] = useState<SnakeData[]>([
    gameState.snakes.get("user1")!,
  ]);

  // const position: Position = {
  //   x: 100,
  //   y: 500,
  // };

  // const orb: OrbData = { position, size: OrbSize.LARGE };

  // const [gameState, setGameState] = useState<GameState>({
  //   snakes: new Map([["user1", snake]]),
  //   otherBodies: new Set(),
  //   orbs: new Set([orb]),
  //   scores: new Map([["user1", 0]]),
  //   gameCode: "abc",
  // });

  return (
    <div>
      <GameCanvas
        gameState={gameState}
        setGameState={setGameState}
        user={"user1"}
        socket={socket}
      />
      <Leaderboard leaderboard={scores} />
      <GameCode gameCode={gameCode} />
    </div>
    //player's score
  );
}

function extractLeaderboardMap(leaderboardData: leaderboardEntry[]) {
  const leaderboard: Map<string, number> = new Map<string, number>();
  leaderboardData.forEach((entry: leaderboardEntry) => {
    leaderboard.set(entry.username, entry.score);
  });
  return leaderboard;
}

//here we want to take in gamestate data and load everything
//i.e. load canvas, put snakes on top, render orbs, check mouse movements to move the snake, send data back to server, etc.
//essentially we should be calling everything from here

//Gamestate data -> passes info about snake, leaderboard, etc. to Game
//What does GameCanvas need? -> position of everybody else's snake (maybe as an array idk)
//For each snake that is given to gamecanvas, render a snake component
//We should also store a double ended queue in GameCanvas that represents your own snake, the window should always center around this snake
//
//Each snake component is a double ended queue of SnakeBodyparts that have an x, y coordinate
//

//CURRENT GOAL IS TO TRY TO GET A COLLECTION OF RENDERED CIRCLES THAT FOLLOW MOUSE
