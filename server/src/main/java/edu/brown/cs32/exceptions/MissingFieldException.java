package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;

public class MissingFieldException extends Exception{
  final Message incompleteMessage;
  public final MessageType messageType;

  public MissingFieldException(Message incompleteMessage, MessageType messageType) {
    this.incompleteMessage = incompleteMessage;
    this.messageType = messageType;
  }
}
