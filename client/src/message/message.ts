import MessageType from "./messageTypes";

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

export interface UpdateScoreMessage {
  type: MessageType.UPDATE_SCORE;
  data: {
    newScore: number;
  };
}

export interface UserDiedMessage {
  type: MessageType.USER_DIED;
  data: {};
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

export function sendUpdateScoreMessage(socket: WebSocket, newScore: number) {
  const message: UpdateScoreMessage = {
    type: MessageType.UPDATE_SCORE,
    data: {
      newScore: newScore,
    },
  };
  socket.send(JSON.stringify(message));
}

export function sendUserDiedMessage(socket: WebSocket) {
  const message: UserDiedMessage = {
    type: MessageType.USER_DIED,
    data: {},
  };
  socket.send(JSON.stringify(message));
}
