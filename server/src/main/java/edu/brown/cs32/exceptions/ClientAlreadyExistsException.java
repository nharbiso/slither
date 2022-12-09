package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class ClientAlreadyExistsException extends Exception {

  public final MessageType messageType;

  public ClientAlreadyExistsException(MessageType messageType){
    this.messageType = messageType;
  };

}
