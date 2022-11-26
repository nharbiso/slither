package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.Message;

public class MissingFieldException extends Exception{
  final Message incompleteMessage;

  public MissingFieldException(Message incompleteMessage) {
    this.incompleteMessage = incompleteMessage;
  }
}
