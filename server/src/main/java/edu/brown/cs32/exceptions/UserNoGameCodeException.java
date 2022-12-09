package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class UserNoGameCodeException extends Exception {

    public final MessageType messageType;

    public UserNoGameCodeException(MessageType messageType) {
        this.messageType = messageType;
    }
}
