package edu.brown.cs32.exceptions;

import edu.brown.cs32.message.MessageType;
import java.net.Socket;

public class SocketAlreadyExistsException extends Exception {

    public final MessageType messageType;

    public SocketAlreadyExistsException(MessageType messageType) {
        this.messageType = messageType;
    }
}
