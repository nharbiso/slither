package edu.brown.cs32.actionHandlers;

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

  public void handlePositionUpdate(User thisUser, Message message, GameState gameState, WebSocket webSocket, Set<WebSocket> gameStateSockets, SlitherServer server) throws MissingFieldException {
    if (!(message.data().containsKey("add") && message.data().containsKey("remove")))
      throw new MissingFieldException(message, MessageType.ERROR);
    System.out.println("checked first if condition");
    System.out.println("add field:");
    System.out.println(message.data().get("add"));
    Map<String, Double> addData = (Map<String, Double>) message.data().get("add");
    Map<String, Double> removeData = (Map<String, Double>) message.data().get("remove");
    System.out.println("Got both maps");
    System.out.println("addData" + addData);
    System.out.println(addData.keySet());
    System.out.println("addData x: " + addData.get("x"));
//    System.out.println("assigned to x: " + x);
    if ((!(addData.containsKey("x") && addData.containsKey("y"))) || (!(removeData.containsKey("x") && removeData.containsKey("y"))))
      throw new MissingFieldException(message, MessageType.ERROR);
    System.out.println("Try to create position toAdd");
    System.out.println("x type: " + addData.get("x").getClass().getName());
    Position toAdd = new Position(addData.get("x"), addData.get("y"));
//    System.out.println("toAdd: " + toAdd);
    Position toRemove = new Position(removeData.get("x"), removeData.get("y"));
//    System.out.println("toRemove: " + toRemove);
    gameState.updateOtherUsersWithPosition(thisUser, toAdd, toRemove, webSocket, gameStateSockets, server);
    System.out.println("After gameState update");
  }

}
