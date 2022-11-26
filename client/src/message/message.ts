import MessageType from "./messageTypes";

interface Message {
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

export default Message;
