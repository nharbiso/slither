package edu.brown.cs32.actionHandlers;

import edu.brown.cs32.exceptions.InvalidRemoveCoordinateException;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.gameState.GameState;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.position.Position;
import edu.brown.cs32.server.SlitherServer;
import edu.brown.cs32.user.User;
import java.util.Map;
import java.util.Set;
import org.java_websocket.WebSocket;

public class UpdatePositionHandler {

  public void handlePositionUpdate(User thisUser, Message message, GameState gameState, WebSocket webSocket, Set<WebSocket> gameStateSockets, SlitherServer server) throws MissingFieldException, InvalidRemoveCoordinateException {
    if (!(message.data().containsKey("add") && message.data().containsKey("remove")))
      throw new MissingFieldException(message, MessageType.ERROR);
    Map<String, Double> addData = (Map<String, Double>) message.data().get("add");
    Map<String, Double> removeData = (Map<String, Double>) message.data().get("remove");
    if ((!(addData.containsKey("x") && addData.containsKey("y"))) || (!(removeData.containsKey("x") && removeData.containsKey("y"))))
      throw new MissingFieldException(message, MessageType.ERROR);
    Position toAdd = new Position(addData.get("x"), addData.get("y"));
    Position toRemove = new Position(removeData.get("x"), removeData.get("y"));
    gameState.updateOwnPositions(thisUser, toAdd, toRemove);
    gameState.updateOtherUsersWithPosition(thisUser, toAdd, toRemove, webSocket, gameStateSockets, server);

//    Thread t = new Thread(() -> gameState.collisionCheck(thisUser, toAdd, webSocket, gameStateSockets, server));
    gameState.collisionCheck(thisUser, toAdd, webSocket, gameStateSockets, server);
//    t.start();
  }

}
