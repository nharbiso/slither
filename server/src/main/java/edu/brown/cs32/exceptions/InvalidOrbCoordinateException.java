package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class InvalidOrbCoordinateException extends Exception {

  public final MessageType messageType;

  public InvalidOrbCoordinateException(MessageType messageType) {
    this.messageType = messageType;
  }

}
