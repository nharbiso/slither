package edu.brown.cs32.actionHandlers;

import edu.brown.cs32.exceptions.ClientAlreadyExistsException;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.server.SlitherServer;
import edu.brown.cs32.user.User;
import org.java_websocket.WebSocket;

public class NewClientHandler {

  public User handleNewClient(Message message, WebSocket websocket, SlitherServer server) throws MissingFieldException, ClientAlreadyExistsException {
    if (!message.data().containsKey("username"))
      throw new MissingFieldException(message);
    User user = new User(message.data().get("username").toString());
    boolean result = server.addWebsocketUser(websocket, user);
    if (!result)
      throw new ClientAlreadyExistsException();
    return user;
  }
}
