import MessageType from "./messageTypes";

export default interface Message {
  type: MessageType;
  data: any; // TODO: update later to make this more specific if possible
}

export interface NewClientMessage {
  type: MessageType.NEW_CLIENT;
  data: {
    username: string;
  };
}

export interface UpdateScoreMessage {
  type: MessageType.UPDATE_SCORE;
  data: {
    newScore: number;
  };
}

export function sendNewClientMessage(socket: WebSocket, username: string) {
  const message: NewClientMessage = {
    type: MessageType.NEW_CLIENT,
    data: {
      username: username,
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
