package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class InvalidRemoveCoordinateException extends Exception {

  public final MessageType messageType;

  public InvalidRemoveCoordinateException(MessageType messageType) {
    this.messageType = messageType;
  }

}
