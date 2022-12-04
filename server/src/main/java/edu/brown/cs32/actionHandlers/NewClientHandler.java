package edu.brown.cs32.actionHandlers;

import edu.brown.cs32.exceptions.ClientAlreadyExistsException;
import edu.brown.cs32.exceptions.IncorrectGameCodeException;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.server.SlitherServer;
import edu.brown.cs32.user.User;
import org.java_websocket.WebSocket;

public class NewClientHandler {

  public User handleNewClientWithCode(Message message, WebSocket websocket, SlitherServer server) throws MissingFieldException, ClientAlreadyExistsException, IncorrectGameCodeException {
    if (!message.data().containsKey("username") || !message.data().containsKey("gameCode"))
      throw new MissingFieldException(message, MessageType.JOIN_ERROR);
    User user = new User(message.data().get("username").toString());
    String gameCode = message.data().get("gameCode").toString();
    if (!server.getExistingGameCodes().contains(gameCode))
      throw new IncorrectGameCodeException(MessageType.JOIN_ERROR);
    boolean result = server.addWebsocketUser(websocket, user);
    if (!result)
      throw new ClientAlreadyExistsException(MessageType.JOIN_ERROR);
    server.addGameCodeToUser(gameCode, user);
    return user;
  }

  public User handleNewClientNoCode(Message message, WebSocket websocket, SlitherServer server) throws MissingFieldException, ClientAlreadyExistsException {
    if (!message.data().containsKey("username"))
      throw new MissingFieldException(message, MessageType.JOIN_ERROR);
    User user = new User(message.data().get("username").toString());
    boolean result = server.addWebsocketUser(websocket, user);
    if (!result)
      throw new ClientAlreadyExistsException(MessageType.JOIN_ERROR);
    return user;
  }
}
