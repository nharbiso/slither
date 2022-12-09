package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class MissingGameStateException extends Exception {

    public final MessageType messageType;

    public MissingGameStateException(MessageType messageType) {
        this.messageType = messageType;
    }
}
