package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;

public class GameCodeNoLeaderboardException extends Exception {

    public final MessageType messageType;

    public GameCodeNoLeaderboardException(MessageType messageType) {
        this.messageType = messageType;
    }
}
