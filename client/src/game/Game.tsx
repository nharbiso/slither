import React, { Dispatch, SetStateAction } from "react";
import Denque from "denque";

import GameState, { Position } from "./GameState";
import GameCanvas from "./GameCanvas";
import Leaderboard from "../leaderboard/Leaderboard";
import GameCode from "../gameCode/GameCode";
import { OrbData } from "./orb/Orb";

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
  HOST: "//0.tcp.ngrok.io:14200",
  PORT: ":9000",
};

let socket: WebSocket;

export function registerSocket(
  setScores: Dispatch<SetStateAction<Map<string, number>>>,
  setGameStarted: Dispatch<SetStateAction<boolean>>,
  setErrorText: Dispatch<SetStateAction<string>>,
  setGameCode: Dispatch<SetStateAction<string>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  username: string,
  hasGameCode: boolean,
  gameCode: string = ""
) {
  // socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT); //this one is used when you are using your own localhost
  socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST); //this one is used for ngrok

  socket.onopen = () => {
    console.log("client: A new client-side socket was opened!");
    if (hasGameCode) {
      sendNewClientWithCodeMessage(socket, username, gameCode);
    } else {
      sendNewClientNoCodeMessage(socket, username);
    }
  };
  //different message types to send to the server based on the action taken/observed by the client
  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
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
        //update position message
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
    }
  };

  socket.onerror = () => setErrorText("Error: No server running!");
}

interface GameProps {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  scores: Map<string, number>;
  setScores: Dispatch<SetStateAction<Map<string, number>>>;
  gameCode: string;
  setGameCode: Dispatch<SetStateAction<string>>;
}

/**
 * Game consists of the GameCanvas, Leaderboard, and GameCode. GameCanvas has
 * most of the actual game, leaderboard displays the top scores, and gamecode
 * displays the current lobby's gamecode.
 * @param param0
 * @returns
 */
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

//This is what actually creates/sets the scores given a set of scores from the server
function extractLeaderboardMap(leaderboardData: leaderboardEntry[]) {
  const leaderboard: Map<string, number> = new Map<string, number>();
  leaderboardData.forEach((entry: leaderboardEntry) => {
    leaderboard.set(entry.username, entry.score);
  });
  return leaderboard;
}
