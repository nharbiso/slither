import { Dispatch, SetStateAction } from "react";

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

/**
 * An interface representing data passed to the HTML element responsible for
 * rendering the Slither+ game
 */
interface GameProps {
  /** A metadata representation of the current state of the game */
  gameState: GameState;
  /** A function that sets the current state of the game */
  setGameState: Dispatch<SetStateAction<GameState>>;
  /** A map from each user, as a string, to their score */
  scores: Map<string, number>;
  /** The game code of the game current being played */
  gameCode: string;
}

/**
 * Returns an HTML element that renders the Slither+ game, which includes the 
 * game canvas, which renders map, snakes, and orbs, as well as the leaderboard
 * with each user's score and the game code of the current lobby.
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param scores A map from each user, as a string, to their score
 * @param gameCode The game code of the game current being played
 * @returns the rendered representation of the client's current Slither+ game
 */
export default function Game({gameState, setGameState, scores, gameCode}: GameProps) {
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
  );
}

//----------------------------------------------------------------------------
// Websocket with backend set-up

/** Metadata for forming the URL to connect with the server websocket */
const AppConfig = {
  PROTOCOL: "ws:",
  HOST: "//0.tcp.ngrok.io:14200",
  PORT: ":9000",
};

/** The client's websocket for communication with the server */
let socket: WebSocket;

/**
 * Creates a websocket for communcation with the Slither+ server
 * @param setScores A funcion that sets the current leaderboard (set of scores) for the game
 * @param setGameStarted A function that sets whether or not the client has started playing the game
 * @param setErrorText A function that sets any error message to be rendered on the home page
 * @param setGameCode A function that sets the current lobby's game code
 * @param orbSet A list of all orbs stored in metadata form 
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param username The username of the client
 * @param hasGameCode A boolean representing whether or not the client is 
 * joining an existing game with a game code
 * @param gameCode The game code entered by the client, if applicable
 */
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

  // running game on localhost
  socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT);
  
  // running game on ngrok
  // socket = new WebSocket(AppConfig.PROTOCOL + AppConfig.HOST);

  socket.onopen = () => {
    console.log("client: A new client-side socket was opened!");
    if (hasGameCode) {
      sendNewClientWithCodeMessage(socket, username, gameCode);
    } else {
      sendNewClientNoCodeMessage(socket, username);
    }
  };
  
  // different functionality based on received message type from server
  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
    switch (message.type) {

      // successfully joined a game
      case MessageType.JOIN_SUCCESS: {
        setGameStarted(true);
        break;
      }

      // unsuccessfully joined a game
      case MessageType.JOIN_ERROR: {
        setErrorText("Error: Failed to join the game!");
        setGameStarted(false); // not truly necessary, just to be safe
        break;
      }

      // updates position of all snakes on screen
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

      // client's snake died
      case MessageType.YOU_DIED: {
        // currently just reloading to force the home screen to open
        // see if we want to do anything else here
        window.location.reload();
        break;
      }

      // another client's snake died
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

      // updating users' scores
      case MessageType.UPDATE_LEADERBOARD: {
        const leaderboardMessage: leaderboardData = message;
        setScores(extractLeaderboardMap(leaderboardMessage.data.leaderboard));
        break;
      }

      // setting the client's game code
      case MessageType.SET_GAME_CODE: {
        console.log("gc");
        console.log(message.data.gameCode);
        setGameCode(message.data.gameCode);
        break;
      }

      // updating the set of orbs for the client's game
      case MessageType.SEND_ORBS: {
        orbSet = message.data.orbSet;
        gameState.orbs = orbSet;
        setGameState(gameState);
        break;
      }

      // the client's snake increased in length (ate an orb)
      case MessageType.INCREASE_OWN_LENGTH: {
        console.log("increase own length message");
        const increaseLengthMessage: IncreaseOwnLengthMessage = message;
        const newBodyParts: Position[] =
          increaseLengthMessage.data.newBodyParts;
        const newGameState: GameState = { ...gameState };
        newBodyParts.forEach((bodyPart: Position) => {
          newGameState.snakes.get("user1")?.snakeBody.push(bodyPart);
        });
        setGameState(newGameState);
        break;
      }

      // another client's snake increased in length (ate an orb)
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

  // if any error in the server occurs
  socket.onerror = () => setErrorText("Error: No server running!");
}

/**
 * Extracts and returns a map of users to their scores, from a server
 * websocket message
 * @param leaderboardData a list of leaderboard entries, from a server websocket message
 * @returns a map of users to their scores
 */
export function extractLeaderboardMap(leaderboardData: leaderboardEntry[]) {
  const leaderboard: Map<string, number> = new Map<string, number>();
  leaderboardData.forEach((entry: leaderboardEntry) => {
    leaderboard.set(entry.username, entry.score);
  });
  return leaderboard;
}