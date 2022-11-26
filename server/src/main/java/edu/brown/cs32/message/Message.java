package edu.brown.cs32.message;

import edu.brown.cs32.user.User;
import java.util.Map;

// TODO: Consider making the type of data more specific, rather than Map<String, Object>
public record Message(MessageType type, Map<String, Object> data) {}
