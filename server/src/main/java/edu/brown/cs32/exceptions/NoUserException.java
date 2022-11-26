package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class NoUserException extends Exception {
  final MessageType messageType;

  public NoUserException(MessageType messageType) {
    this.messageType = messageType;
  }
}
