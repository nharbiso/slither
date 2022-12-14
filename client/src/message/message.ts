import MessageType from "./messageTypes";
import { Position } from "../game/GameState";
import { OrbData } from "../game/orb/Orb";

export default interface Message {
  type: MessageType;
  data: any; // TODO: update later to make this more specific if possible
}

export interface NewClientNoCodeMessage {
  type: MessageType.NEW_CLIENT_NO_CODE;
  data: {
    username: string;
  };
}

export interface NewClientOldCodeMessage {
  type: MessageType.NEW_CLIENT_WITH_CODE;
  data: {
    username: string;
    gameCode: string;
  };
}

export interface RemoveOrbMessage {
  type: MessageType.REMOVE_ORB;
  data: {
    position: Position;
  };
}

export interface UpdatePositionMessage {
  type: MessageType.UPDATE_POSITION;
  data: {
    add: Position; // the new circle's position
    remove: Position; // the circle being removed
  };
}

export interface UpdateScoreMessage {
  type: MessageType.UPDATE_SCORE;
  data: {
    newScore: number;
  };
}

export function sendNewClientNoCodeMessage(
  socket: WebSocket,
  username: string
) {
  const message: NewClientNoCodeMessage = {
    type: MessageType.NEW_CLIENT_NO_CODE,
    data: {
      username: username,
    },
  };
  socket.send(JSON.stringify(message));
}

// sent to register a username for a client (when a client is joining a game)
export function sendNewClientWithCodeMessage(
  socket: WebSocket,
  username: string,
  gameCode: string
) {
  const message: NewClientOldCodeMessage = {
    type: MessageType.NEW_CLIENT_WITH_CODE,
    data: {
      username: username,
      gameCode: gameCode,
    },
  };
  socket.send(JSON.stringify(message));
}

export function sendRemoveOrbMessage(socket: WebSocket, position: Position) {
  const message: RemoveOrbMessage = {
    type: MessageType.REMOVE_ORB,
    data: {
      position: position,
    },
  };
  socket.send(JSON.stringify(message));
}

export function sendUpdatePositionMessage(
  socket: WebSocket,
  add: Position,
  remove: Position
) {
  const message: UpdatePositionMessage = {
    type: MessageType.UPDATE_POSITION,
    data: {
      add: add,
      remove: remove,
    },
  };
  socket.send(JSON.stringify(message));
}

export function sendUpdateScoreMessage(socket: WebSocket, newScore: number) {
  const message: UpdateScoreMessage = {
    type: MessageType.UPDATE_SCORE,
    data: {
      newScore: newScore,
    },
  };
  socket.send(JSON.stringify(message));
}

// TYPES FOR MESSAGES RECEIVED FROM THE SERVER

export interface leaderboardData {
  type: MessageType.UPDATE_LEADERBOARD;
  data: {
    leaderboard: leaderboardEntry[];
  };
}

export interface leaderboardEntry {
  username: string;
  score: number;
}

export interface gameCode {
  type: MessageType.SET_GAME_CODE;
  data: {
    gameCode: string;
  };
}

export interface orbsData {
  type: MessageType.SEND_ORBS;
  data: {
    orbSet: Set<OrbData>;
  };
}

export interface YouDiedMessage {
  type: MessageType.YOU_DIED;
  data: {};
}

export interface OtherUserDiedMessage {
  type: MessageType.OTHER_USED_DIED;
  data: {
    removePositions: Position[];
  };
}

export interface IncreaseOwnLengthMessage {
  type: MessageType.INCREASE_OWN_LENGTH;
  data: {
    newBodyParts: Position[];
  };
}

export interface IncreaseOtherLengthMessage {
  type: MessageType.INCREASE_OTHER_LENGTH;
  data: {
    newBodyParts: Position[];
  };
}
