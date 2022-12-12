package edu.brown.cs32.gameState;

import edu.brown.cs32.actionHandlers.RemoveOrbHandler;
import edu.brown.cs32.exceptions.InvalidRemoveCoordinateException;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.leaderboard.Leaderboard;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.position.Position;
import edu.brown.cs32.orb.Orb;
import edu.brown.cs32.orb.OrbGenerator;
import edu.brown.cs32.orb.OrbSize;
import edu.brown.cs32.server.SlitherServer;
import edu.brown.cs32.user.User;

import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import org.java_websocket.WebSocket;

public class GameState {

  private SlitherServer slitherServer;
  private String gameCode;
  private Set<Orb> orbs;
  private Set<Orb> deathOrbs; // only formed when people die
  private final OrbGenerator orbGenerator = new OrbGenerator();
  private final int ORB_GENERATION_TIME_INTERVAL = 5;
  private Map<User, Set<Position>> userToOthersPositions;
  private Map<User, Set<Position>> userToOwnPositions;
//  private Map<User, List<Position>> userToLastTwoOwnPositions;
  private Map<User, Deque<Position>> userToSnakeDeque;
  private final int SNAKE_CIRCLE_RADIUS = 35;

  public GameState(SlitherServer slitherServer, String gameCode) {
    this.slitherServer = slitherServer;
    this.gameCode = gameCode;
    this.orbs = new HashSet<Orb>();
    this.userToOthersPositions = new HashMap<>();
    this.userToOwnPositions = new HashMap<>();
//    this.userToLastTwoOwnPositions = new HashMap<>();
    this.userToSnakeDeque = new HashMap<>();
    ScheduledThreadPoolExecutor exec = new ScheduledThreadPoolExecutor(1);
    exec.scheduleAtFixedRate(new Runnable() {
      public void run() {
        // code to execute repeatedly
        System.out.println("Try to generate orbs");
        GameState.this.generateOrb();
        GameState.this.sendOrbData();
      }
    }, 0, this.ORB_GENERATION_TIME_INTERVAL, TimeUnit.SECONDS); // execute every 60 seconds
  }

  public void addUser(User user) {
    this.userToOwnPositions.put(user, new HashSet<>());
//    this.userToLastTwoOwnPositions.put(user, new ArrayList<>());
    this.userToOthersPositions.put(user, new HashSet<>());
    this.userToSnakeDeque.put(user, new LinkedList<>());
  }

  public void generateOrb() {
    this.orbGenerator.generateOrbs(this.orbs);
  }

  public boolean removeOrb(Position position) {
    Orb removeOrb = new Orb(position, OrbSize.SMALL, "red"); // OrbSize/color irrelevant for hash equality comparison
    if (!this.orbs.contains(removeOrb))
      return false;
    while (this.orbs.contains(removeOrb)) {
      this.orbs.remove(removeOrb);
    }
    return true;
  }

  public void sendOrbData() {
    Map<String, Object> orbData = new HashMap<>();
    orbData.put("orbSet", this.orbs);
    String json = this.slitherServer.serialize(new Message(MessageType.SEND_ORBS, orbData));    
    this.slitherServer.sendToAllGameStateConnections(this, json);
  }

  public void updateOwnPositions(User thisUser, Position toAdd, Position toRemove) throws InvalidRemoveCoordinateException {
    if (!this.userToOwnPositions.containsKey((thisUser)))
      this.userToOwnPositions.put(thisUser, new HashSet<>());
    this.userToOwnPositions.get(thisUser).add(toAdd);
    this.userToOwnPositions.get(thisUser).remove(toRemove);
//    this.updateOwnLastTwoBodyParts(thisUser, toAdd);

    this.userToSnakeDeque.get(thisUser).addFirst(toAdd);
    if (!this.userToSnakeDeque.get(thisUser).peekLast().equals(toRemove)) {
      System.out.println("To remove error");
      System.out.println(this.userToSnakeDeque.get(thisUser));
      throw new InvalidRemoveCoordinateException(MessageType.ERROR);
    }
    this.userToSnakeDeque.get(thisUser).removeLast();
  }

//  private void updateOwnLastTwoBodyParts(User thisUser, Position toAdd) {
//    if (this.userToLastTwoOwnPositions.get(thisUser).size() < 2)
//      this.userToLastTwoOwnPositions.get(thisUser).add(toAdd);
//    else {
//      this.userToLastTwoOwnPositions.get(thisUser).remove(0);
//      this.userToLastTwoOwnPositions.get(thisUser).add(toAdd);
//    }
//  }

  private void sendOwnIncreasedLengthBodyParts(WebSocket webSocket, List<Position> newBodyParts, SlitherServer server) {
    Map<String, Object> data = new HashMap<>();
    data.put("newBodyParts", newBodyParts);
    Message message = new Message(MessageType.INCREASE_OWN_LENGTH, data);
    webSocket.send(server.serialize(message));
  }

  private void sendOthersIncreasedLengthBodyParts(WebSocket webSocket, List<Position> newBodyParts, Set<WebSocket> gameStateSockets, SlitherServer server) {
    Map<String, Object> data = new HashMap<>();
    data.put("newBodyParts", newBodyParts);
    Message message = new Message(MessageType.INCREASE_OTHER_LENGTH, data);
    String jsonMessage = server.serialize(message);
    for (WebSocket socket : gameStateSockets) {
      if (socket.equals(webSocket))
        continue;
      socket.send(jsonMessage);
    }
  }

  public void createNewSnake(User thisUser, WebSocket webSocket, Set<WebSocket> gameStateSockets, SlitherServer server) {
    List<Position> newSnake = new ArrayList<>();
    for (int i=0; i < 20; i++) {
      Position position = new Position(600, 100 + 5 * i);
      newSnake.add(position);
      this.userToSnakeDeque.get(thisUser).addLast(position);
    }
    this.sendOthersIncreasedLengthBodyParts(webSocket, newSnake, gameStateSockets, server);
  }

  public void updateOtherUsersWithPosition(User thisUser, Position toAdd, Position toRemove, WebSocket webSocket, Set<WebSocket> gameStateSockets, SlitherServer server) {
    for (User user : this.userToOthersPositions.keySet()) {
      if (user.equals(thisUser))
        continue;
      this.userToOthersPositions.get(user).add(toAdd);
      this.userToOthersPositions.get(user).remove(toRemove);
    }

    Map<String, Object> data = new HashMap<>();
    data.put("add", toAdd);
    data.put("remove", toRemove);
    Message message = new Message(MessageType.UPDATE_POSITION, data);
    String jsonResponse = server.serialize(message);

    for (WebSocket socket : gameStateSockets) {
      if (socket.equals(webSocket))
        continue;
      socket.send(jsonResponse);
    }
  }

  private void updateOtherUsersWithRemovedPositions(User thisUser, WebSocket webSocket, Set<WebSocket> gameStateSockets, SlitherServer server) {
    List<Position> removedPositions = new ArrayList<>();
    removedPositions.addAll(this.userToOwnPositions.get(thisUser));
    for (Position position : removedPositions) {
      for (User user : this.userToOthersPositions.keySet()) {
        if (user.equals(thisUser))
          continue;
        this.userToOthersPositions.get(user).remove(position);
      }
    }
    Map<String, Object> data = new HashMap<>();
    data.put("removePositions", removedPositions);
    String jsonMessage = server.serialize(new Message(MessageType.OTHER_USER_DIED, data));
    for (WebSocket socket : gameStateSockets) {
      if (socket.equals(webSocket))
        continue;
      socket.send(jsonMessage);
    }
  }

  private double distance(Position firstCenter, Position secondCenter) {
    return Math.sqrt(Math.pow(firstCenter.x() - secondCenter.x(), 2) + Math.pow(firstCenter.y() - secondCenter.y(), 2));
  }

  private List<Position> getLastTwoBodyParts(Deque<Position> bodyParts) {
    Position lastPosition = bodyParts.removeLast();
    Position secondLastPosition = bodyParts.peekLast();
    bodyParts.addLast(lastPosition);
    List<Position> lastTwoBodyParts = new ArrayList<>();
    lastTwoBodyParts.add(secondLastPosition);
    lastTwoBodyParts.add(lastPosition);
    return lastTwoBodyParts;
  }

  private Position getNewBodyPartPosition(User thisUser) {
//    List<Position> userLastTwoBodyParts = this.userToLastTwoOwnPositions.get(thisUser);
    Deque<Position> userBodyParts = this.userToSnakeDeque.get(thisUser);
    Position newPosition;
    if (userBodyParts.size() == 0)
      newPosition = new Position(600.0, 100.0);
    else if (userBodyParts.size() == 1)
      newPosition = new Position(Math.round(userBodyParts.peekFirst().x() * 100) / 100.0, Math.round((userBodyParts.peekFirst().y() + 5) * 100) / 100.0);
    else {
      List<Position> userLastTwoBodyParts = this.getLastTwoBodyParts(userBodyParts);
      double xDifference = userLastTwoBodyParts.get(0).x() - userLastTwoBodyParts.get(1).x();
      double yDifference = userLastTwoBodyParts.get(0).y() - userLastTwoBodyParts.get(1).y();
      double x = userLastTwoBodyParts.get(1).x() - xDifference;
      double y = userLastTwoBodyParts.get(1).y() - yDifference;
      newPosition = new Position(Math.round(x * 100) / 100.0, Math.round(y * 100) / 100.0);
    }
//    this.updateOwnLastTwoBodyParts(thisUser, newPosition);
    userBodyParts.addLast(newPosition);
    return newPosition;
  }

  public void collisionCheck(User thisUser, Position latestHeadPosition, WebSocket webSocket, Set<WebSocket> gameStateSockets, SlitherServer server) {
    System.out.println("Run collision check");
    Set<Position> otherBodies = this.userToOthersPositions.get(thisUser);
//    Set<Orb> allOrbs = this.orbs;
    Set<Orb> allOrbs = new HashSet<>(this.orbs);
    if( latestHeadPosition.x() - this.SNAKE_CIRCLE_RADIUS <= -1500 ||
        latestHeadPosition.x() + this.SNAKE_CIRCLE_RADIUS >= 1500 ||
        latestHeadPosition.y() - this.SNAKE_CIRCLE_RADIUS <= -1500 ||
        latestHeadPosition.y() + this.SNAKE_CIRCLE_RADIUS >= 1500
      ) {
      Message userDiedMessage = new Message(MessageType.YOU_DIED, new HashMap<>());
      String jsonMessage = server.serialize(userDiedMessage);
      webSocket.send(jsonMessage);
      this.updateOtherUsersWithRemovedPositions(thisUser, webSocket, gameStateSockets, server);
      this.userToOwnPositions.remove(thisUser);
      this.userToOthersPositions.remove(thisUser);
      this.userToSnakeDeque.remove(thisUser);
      server.handleUserDied(thisUser, webSocket, this);
      return;
    }

    List<Position> newBodyParts = new ArrayList<>();
    for (Orb orb : allOrbs) {
      Position orbPosition = orb.getPosition();
      if (this.distance(latestHeadPosition, orbPosition) <= this.SNAKE_CIRCLE_RADIUS) {
        this.removeOrb(orbPosition);
        this.sendOrbData();
        Integer orbValue = switch(orb.getSize()) {
          case SMALL -> 1;
          case LARGE -> 10;
        };
        server.handleUpdateScore(thisUser, this, orbValue);

        for (int i=0; i < orbValue; i++)
          newBodyParts.add(this.getNewBodyPartPosition(thisUser));
      }
    }

    if (newBodyParts.size() > 0) {
      this.sendOwnIncreasedLengthBodyParts(webSocket, newBodyParts, server);
      this.sendOthersIncreasedLengthBodyParts(webSocket, newBodyParts, gameStateSockets, server);
    }

    for (Position otherBodyPosition : otherBodies) {
      if (this.distance(latestHeadPosition, otherBodyPosition) <= this.SNAKE_CIRCLE_RADIUS) {
        Message userDiedMessage = new Message(MessageType.YOU_DIED, new HashMap<>());
        String jsonMessage = server.serialize(userDiedMessage);
        webSocket.send(jsonMessage);
        this.updateOtherUsersWithRemovedPositions(thisUser, webSocket, gameStateSockets, server);
        this.userToOwnPositions.remove(thisUser);
        this.userToOthersPositions.remove(thisUser);
        this.userToSnakeDeque.remove(thisUser);
        server.handleUserDied(thisUser, webSocket, this);
        return;
      }
    }
  }

  public String getGameCode() {
    return this.gameCode;
  }
}
