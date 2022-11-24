package edu.brown.cs32.message;

import edu.brown.cs32.user.User;

public record Message(MessageType messageType, String data, User user) {}
