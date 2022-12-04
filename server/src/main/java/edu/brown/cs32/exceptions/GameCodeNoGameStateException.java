package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class GameCodeNoGameStateException extends Exception {

    public final MessageType messageType;

    public GameCodeNoGameStateException(MessageType messageType) {
        this.messageType = messageType;
    }
}
