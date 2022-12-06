import Denque from "denque"
import GameState, { Position } from './GameState'
import OrbSize from "./orb/orbSize";
import { OrbData } from "./orb/Orb"
import { SnakeData, SNAKE_VELOCITY } from "./snake/Snake"
import React, { useState, useEffect } from "react";

import GameCanvas from "./GameCanvas";
import MessageType from "../message/messageTypes";
import {
  leaderboardData,
  leaderboardEntry,
  sendNewClientNoCodeMessage,
} from "../message/message";
import Leaderboard from "../leaderboard/Leaderboard";
import GameCode from "../gameCode/GameCode";

const AppConfig = {
  PROTOCOL: "ws:",
  HOST: "//localhost",
  PORT: ":9000",
};

let toregister: boolean = true;
let socket: WebSocket;

function registerSocket(
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>
) {
  let socket: WebSocket = new WebSocket(
    AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT
  );

  socket.onopen = () => {
    console.log("client: A new client-side socket was opened!");
    // TODO: random string username for now; pass user chosen username later); also pass chosen game code later
    sendNewClientNoCodeMessage(socket, (Math.random() * 1000).toString());
    // sendNewClientWithCodeMessage(
    //   socket,
    //   (Math.random() * 1000).toString(),
    //   "123456"
    // );
  };

  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
    // ideally, we would want to do different things based on the message's type
    console.log("client: A message was received: " + response.data);
    switch (message.type) {
      case MessageType.UPDATE_LEADERBOARD: {
        const leaderboardMessage: leaderboardData = message;
        setScores(
          extractLeaderboardMap(leaderboardMessage.data.leaderboard)
        );
        break;
      }
      case MessageType.SEND_ORBS: {
        break;
      }
    }
      
      // case MessageType.SET_CODE: {

      // }
    }
  };


export default function Game() {
  // register socket
  useEffect(() => {
    if (!toregister) {
      return;
    }
    toregister = false;
    registerSocket(setScores);
  }, []);

  // create snakes
  const snakeBody: Position[] = [];
  for (let i = 0; i < 100; i++) {
    snakeBody.push({ x: 600, y: 100 + 5 * i });
  }
  const snake: SnakeData = {
    snakeBody: new Denque(snakeBody),
    velocityX: 0,
    velocityY: SNAKE_VELOCITY,
  };

  const otherSnakeBody: Position[] = [];
  for (let i = 0; i < 50; i ++) {
    otherSnakeBody.push({x: 100 + 5 * i, y: 400})
  }
  const otherSnake: SnakeData = {
    snakeBody: new Denque(otherSnakeBody),
    velocityX: SNAKE_VELOCITY,
    velocityY: 0,
  };

  // create leaderboard
  const [scores, setScores] = useState(new Map<string, number>());

  const [snakes, setSnakes] = useState<SnakeData[]>([snake, otherSnake]);
  
  // orb generation
  const position: Position = {
        x: 100,
        y: 500
  };
  const orb: OrbData = { position, size: OrbSize.LARGE };

  const [gameState, setGameState] = useState<GameState>({
      snakes: new Map([["user1", snake], ["user2", otherSnake]]),
      otherBodies: new Set(otherSnakeBody),
      orbs: new Set([orb]),
      scores: scores,
      gameCode: "abc"
  });
    
  return (
    <div>
      <GameCanvas gameState={gameState} setGameState={setGameState} user={"user1"} socket={socket}/>
      <Leaderboard leaderboard={scores} />
      <GameCode gameCode = "ABCDEF" />
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
