package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class IncorrectGameCodeException extends Exception{

  public final MessageType messageType;

  public IncorrectGameCodeException(MessageType messageType) {
    this.messageType = messageType;
  }

}
