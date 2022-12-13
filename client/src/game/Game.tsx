import React, { useState, useEffect } from "react";
import Denque from "denque";

import GameState, { Position } from "./GameState";
import GameCanvas from "./GameCanvas";
import Leaderboard from "../leaderboard/Leaderboard";
import GameCode from "../gameCode/GameCode";
import { OrbData } from "./orb/Orb";
import OrbSize from "./orb/orbSize";
import { SnakeData, SNAKE_VELOCITY } from "./snake/Snake";

import MessageType from "../message/messageTypes";
import {
  IncreaseOtherLengthMessage,
  IncreaseOwnLengthMessage,
  leaderboardData,
  leaderboardEntry,
  OtherUserDiedMessage,
  sendNewClientNoCodeMessage,
  sendNewClientWithCodeMessage,
  UpdatePositionMessage,
} from "../message/message";
import { getPositionOfLineAndCharacter } from "typescript";

const AppConfig = {
  PROTOCOL: "ws:",
  HOST: "//0.tcp.ngrok.io:18020",
  PORT: ":9000",
};

// let toregister: boolean = true;
let socket: WebSocket;

export function registerSocket(
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  setGameCode: React.Dispatch<React.SetStateAction<string>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  // snakeLength: number,
  // setSnakeLength: React.Dispatch<React.SetStateAction<number>>,
  username: string,
  hasGameCode: boolean,
  gameCode: string = ""
) {
  // socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT);
  socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST);

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
        const newGameState: GameState = { ...gameState };
        console.log(
          "gameState otherbodies size: " + gameState.otherBodies.size
        );
        newGameState.otherBodies.delete(JSON.stringify(toRemove));
        newGameState.otherBodies.add(JSON.stringify(toAdd));
        setGameState(newGameState);
        break;
      }
      case MessageType.YOU_DIED: {
        // currently just reloading to force the home screen to open
        // see if we want to do anything else here
        window.location.reload();
        break;
      }
      case MessageType.OTHER_USED_DIED: {
        const otherUserDiedMessage: OtherUserDiedMessage = message;
        const removePositions: Position[] =
          otherUserDiedMessage.data.removePositions;
        console.log("removePositions");
        console.log(removePositions);
        const newGameState: GameState = { ...gameState };
        removePositions.forEach((position: Position) => {
          newGameState.otherBodies.delete(JSON.stringify(position));
        });
        setGameState(newGameState);
        break;
      }
      case MessageType.UPDATE_LEADERBOARD: {
        const leaderboardMessage: leaderboardData = message;
        setScores(extractLeaderboardMap(leaderboardMessage.data.leaderboard));
        break;
      }
      case MessageType.SET_GAME_CODE: {
        console.log("gc");
        console.log(message.data.gameCode);
        setGameCode(message.data.gameCode);
        break;
      }
      case MessageType.SEND_ORBS: {
        orbSet = message.data.orbSet;
        gameState.orbs = orbSet;
        setGameState(gameState);
        break;
      }
      case MessageType.INCREASE_OWN_LENGTH: {
        console.log("increase own length message");
        const increaseLengthMessage: IncreaseOwnLengthMessage = message;
        const newBodyParts: Position[] =
          increaseLengthMessage.data.newBodyParts;
        const newGameState: GameState = { ...gameState };
        newBodyParts.forEach((bodyPart: Position) => {
          newGameState.snakes.get("user1")?.snakeBody.push(bodyPart);
        });
        console.log("before");
        console.log(gameState.snakes.get("user1")?.snakeBody.length);
        setGameState(newGameState);
        console.log("after");
        console.log(gameState.snakes.get("user1")?.snakeBody.length);
        break;
      }
      case MessageType.INCREASE_OTHER_LENGTH: {
        const increaseLengthMessage: IncreaseOtherLengthMessage = message;
        const newBodyParts: Position[] =
          increaseLengthMessage.data.newBodyParts;
        const newGameState: GameState = { ...gameState };
        newBodyParts.forEach((bodyPart: Position) => {
          newGameState.otherBodies.add(JSON.stringify(bodyPart));
        });
        setGameState(newGameState);
        break;
      }
      // case MessageType.UPDATE_SCORE: {
      //   break;
      // }
    }
  };

  socket.onerror = () => setErrorText("Error: No server running!");
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
