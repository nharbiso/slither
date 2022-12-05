package edu.brown.cs32.server;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs32.actionHandlers.NewClientHandler;
import edu.brown.cs32.actionHandlers.RemoveOrbHandler;
import edu.brown.cs32.actionHandlers.UpdatePositionHandler;
import edu.brown.cs32.actionHandlers.UpdateScoreHandler;
import edu.brown.cs32.actionHandlers.UserDiedHandler;
import edu.brown.cs32.exceptions.ClientAlreadyExistsException;
import edu.brown.cs32.exceptions.IncorrectGameCodeException;
import edu.brown.cs32.exceptions.InvalidOrbCoordinateException;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.exceptions.MissingGameStateException;
import edu.brown.cs32.exceptions.NoUserException;
import edu.brown.cs32.exceptions.SocketAlreadyExistsException;
import edu.brown.cs32.exceptions.UserNoGameCodeException;
import edu.brown.cs32.exceptions.GameCodeNoGameStateException;
import edu.brown.cs32.exceptions.GameCodeNoLeaderboardException;
import edu.brown.cs32.gameState.GameState;
import edu.brown.cs32.gamecode.GameCode;
import edu.brown.cs32.gamecode.GameCodeGenerator;
import edu.brown.cs32.leaderboard.Leaderboard;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.user.User;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class SlitherServer extends WebSocketServer {

  private final Set<WebSocket> allConnections; // stores all connections
  private final Set<WebSocket> inactiveConnections; // stores connections for clients whose users are not actively playing
//  private final Leaderboard leaderboard;
  private final Map<User, String> userToGameCode;
  private final Map<String, Leaderboard> gameCodeToLeaderboard;
  private final Map<WebSocket, User> socketToUser;
  private final Map<String, GameState> gameCodeToGameState;
  private final Map<GameState, Set<WebSocket>> gameStateToSockets;

  public SlitherServer(int port) {
    super(new InetSocketAddress(port));
    this.allConnections = new HashSet<>();
    this.inactiveConnections = new HashSet<>();
    this.userToGameCode = new HashMap<>();
    this.gameCodeToLeaderboard = new HashMap<>();
//    this.leaderboard = new Leaderboard();
    this.socketToUser = new HashMap<>();
    this.gameCodeToGameState = new HashMap<>();
    this.gameStateToSockets = new HashMap<>();
  }

  public Set<WebSocket> getAllConnections() {
    return new HashSet<>(this.allConnections);
  }

  public Set<WebSocket> getInactiveConnections() {
    return new HashSet<>(this.inactiveConnections);
  }

  public Map<String, GameState> getGameCodeToGameState() { return new HashMap<>(this.gameCodeToGameState); }

  public Set<String> getExistingGameCodes() { return this.gameCodeToLeaderboard.keySet(); }

  private void sendToAllActiveConnections(String messageJson) {
    for (WebSocket webSocket : this.allConnections) {
      if (this.inactiveConnections.contains(webSocket))
        continue;
      webSocket.send(messageJson);
    }
  }

  public void sendToAllGameStateConnections(GameState gameState, String messageJson) {
    Set<WebSocket> gameSockets = this.gameStateToSockets.get(gameState);
    for (WebSocket webSocket : gameSockets) {
      webSocket.send(messageJson);
    }
  }

  public boolean addGameCodeToUser(String gameCode, User user) {
    if (this.userToGameCode.containsKey(user))
      return false;
    this.userToGameCode.put(user, gameCode);
    return true;
  }

  public boolean addWebsocketUser(WebSocket webSocket, User user) {
    if (this.socketToUser.containsKey(webSocket))
      return false;
    this.socketToUser.put(webSocket, user);
    return true;
  }

  public boolean addSocketToGameState(String gameCode, WebSocket webSocket) throws MissingGameStateException {
    GameState gameState = this.gameCodeToGameState.get(gameCode);
    if (gameState == null || this.gameStateToSockets.get(gameState) == null) 
      throw new MissingGameStateException(MessageType.JOIN_ERROR);
    if (this.gameStateToSockets.get(gameState).contains(webSocket)) 
      return false;
    this.gameStateToSockets.get(gameState).add(webSocket);
    return true;
  }

  @Override
  public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
    System.out.println("server: onOpen called");
    this.allConnections.add(webSocket);
    this.inactiveConnections.add(webSocket);
    System.out.println("server: New client joined - Connection from " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    System.out.println("server: new activeConnections: " + this.allConnections);
    String jsonResponse = this.serialize(this.generateMessage("New socket opened", MessageType.SUCCESS));
    webSocket.send(jsonResponse);
  }

  @Override
  public void onClose(WebSocket webSocket, int code, String reason, boolean remote) {
    System.out.println("server: onClose called");
    this.allConnections.remove(webSocket);
    this.inactiveConnections.remove(webSocket);
    User user = this.socketToUser.get(webSocket);
    if (user == null)
      return;
    String gameCode = this.userToGameCode.get(user);
    if (gameCode == null)
      return;
    GameState gameState = this.gameCodeToGameState.get(gameCode);
    if (gameState == null)
      return;
    this.gameStateToSockets.get(gameState).remove(webSocket);
  }

  @Override
  public void onMessage(WebSocket webSocket, String jsonMessage) {
    System.out.println("server: Message received from client: " + jsonMessage);
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Message> jsonAdapter = moshi.adapter(Message.class);
    String jsonResponse;
    try {
      Message deserializedMessage = jsonAdapter.fromJson(jsonMessage);
      switch (deserializedMessage.type()) {
        case NEW_CLIENT_WITH_CODE -> {
          this.inactiveConnections.remove(webSocket);
          User newUser = new NewClientHandler().handleNewClientWithCode(deserializedMessage, webSocket, this);
          String existingGameCode = this.userToGameCode.get(newUser);
//          this.leaderboard.addNewUser(newUser);
          if (existingGameCode == null) {
            throw new UserNoGameCodeException(MessageType.JOIN_ERROR);
          }
          if (this.gameCodeToLeaderboard.get(existingGameCode) == null) {
            throw new GameCodeNoLeaderboardException(MessageType.JOIN_ERROR);
          }
          this.gameCodeToLeaderboard.get(existingGameCode).addNewUser(newUser);
          if (!this.gameCodeToGameState.containsKey(this.userToGameCode.get(newUser)))
            throw new GameCodeNoGameStateException(MessageType.JOIN_ERROR);
          this.addSocketToGameState(existingGameCode, webSocket);

          GameCode.sendGameCode(existingGameCode, this.gameCodeToGameState.get(existingGameCode), this);          

          Message message = this.generateMessage("New client added to existing game code", MessageType.JOIN_SUCCESS);
          message.data().put("gameCode", this.userToGameCode.get(newUser));
          jsonResponse = this.serialize(message);
          System.out.println("WC: " + jsonResponse);
          webSocket.send(jsonResponse);
          break;
        }
        case NEW_CLIENT_NO_CODE -> {
          this.inactiveConnections.remove(webSocket);
          User newUser = new NewClientHandler().handleNewClientNoCode(deserializedMessage, webSocket, this);
          String gameCode = new GameCodeGenerator().generateGameCode(this.getExistingGameCodes());
          this.gameCodeToGameState.put(gameCode, new GameState());
          this.gameStateToSockets.put(this.gameCodeToGameState.get(gameCode), new HashSet<>());
          Leaderboard leaderboard = new Leaderboard(this.gameCodeToGameState.get(gameCode), this);
          leaderboard.addNewUser(newUser);
          this.userToGameCode.put(newUser, gameCode);
          this.gameCodeToLeaderboard.put(gameCode, leaderboard);

          boolean result = this.addSocketToGameState(gameCode, webSocket);

          if (!result)
            throw new SocketAlreadyExistsException(MessageType.JOIN_ERROR);

          GameCode.sendGameCode(gameCode, this.gameCodeToGameState.get(gameCode), this);          

          Message message = this.generateMessage("New client added to new game", MessageType.JOIN_SUCCESS);
          message.data().put("gameCode", gameCode);
          jsonResponse = this.serialize(message);
          System.out.println("NC: " + jsonResponse);
          webSocket.send(jsonResponse);
          break;
        }
        case UPDATE_POSITION -> {
          User user = this.socketToUser.get(webSocket);
          System.out.println("User" + user);
          String gameCode = this.userToGameCode.get(user);
          System.out.println("gameCode: " + gameCode);
          if (gameCode == null)
            throw new UserNoGameCodeException(MessageType.ERROR);
          GameState gameState = this.gameCodeToGameState.get(gameCode);
          if (gameState == null)
            throw new GameCodeNoGameStateException(MessageType.ERROR);

          System.out.println("Before handlePositionUpdate");
          new UpdatePositionHandler().handlePositionUpdate(user, deserializedMessage, gameState, webSocket, this.gameStateToSockets.get(gameState), this);
          System.out.println("After handlePositionUpdate");
          break;
        }
        case UPDATE_SCORE -> {
          User user = this.socketToUser.get(webSocket);
          if (user == null)
            throw new NoUserException(deserializedMessage.type());
          int newScore = new UpdateScoreHandler().handleScoreUpdate(deserializedMessage, user);
//          this.leaderboard.updateScore(user, newScore);
          if (this.userToGameCode.get(user) == null) {
            throw new UserNoGameCodeException(MessageType.ERROR);
          }
          if (this.gameCodeToLeaderboard.get(this.userToGameCode.get(user)) == null) {
            throw new GameCodeNoLeaderboardException(MessageType.ERROR);
          }
          this.gameCodeToLeaderboard.get(this.userToGameCode.get(user)).updateScore(user, newScore);
          jsonResponse = this.serialize(this.generateMessage("Score updated", MessageType.SUCCESS));
          webSocket.send(jsonResponse);
          break;
        }
        case USER_DIED -> {
          // TODO: Add to deathOrbs set in gamestate when this happens
          User user = this.socketToUser.get(webSocket);
          if (user == null)
            throw new NoUserException(deserializedMessage.type());
//          new UserDiedHandler().handleUserDied(user, this.leaderboard);
          new UserDiedHandler().handleUserDied(user, this.gameCodeToLeaderboard.get(this.userToGameCode.get(user)));
          this.userToGameCode.remove(user);
          this.inactiveConnections.add(webSocket);
          
          String gameCode = this.userToGameCode.get(user);
          if (gameCode == null) 
            throw new UserNoGameCodeException(MessageType.ERROR);
        
          GameState gameState = this.gameCodeToGameState.get(gameCode);
          if (gameState == null)
            throw new GameCodeNoGameStateException(MessageType.ERROR);

          this.gameStateToSockets.get(gameState).remove(webSocket);

          jsonResponse = this.serialize(this.generateMessage("User removed from leaderboard", MessageType.SUCCESS));
          webSocket.send(jsonResponse);
          break;
        }
        case REMOVE_ORB -> {
          User user = this.socketToUser.get(webSocket);
          if (user == null)
            throw new NoUserException(deserializedMessage.type());
          if (this.userToGameCode.get(user) == null) {
            throw new UserNoGameCodeException(MessageType.ERROR);
          }
          String gameCode = this.userToGameCode.get(user);
          if (this.gameCodeToGameState.get(gameCode) == null) {
            throw new GameCodeNoGameStateException(MessageType.ERROR);
          }
          GameState gameState = this.gameCodeToGameState.get(gameCode);
          boolean result = new RemoveOrbHandler().handleRemoveOrb(deserializedMessage, gameState);
          if (!result)
            throw new InvalidOrbCoordinateException(MessageType.ERROR);
          jsonResponse = this.serialize(this.generateMessage("Orb removed", MessageType.SUCCESS));
          webSocket.send(jsonResponse);
          break;
        }
        default -> {
          MessageType messageType = this.socketToUser.containsKey(webSocket) ? MessageType.ERROR : MessageType.JOIN_ERROR;
          jsonResponse = this.serialize(this.generateMessage("The message sent by the client had an unexpected type", messageType));
          webSocket.send(jsonResponse);
          break;
        }
      }
    } catch (IOException e) {
      MessageType messageType = this.socketToUser.containsKey(webSocket) ? MessageType.ERROR : MessageType.JOIN_ERROR;
      jsonResponse = this.serialize(this.generateMessage("The server could not deserialize the client's message", messageType));
      webSocket.send(jsonResponse);
    } catch (MissingFieldException e) {
      jsonResponse = this.serialize(this.generateMessage("The message sent by the client was missing a required field", e.messageType));
      webSocket.send(jsonResponse);
    } catch (NoUserException e) {
      jsonResponse = this.serialize(this.generateMessage("An operation requiring a user was tried before the user existed", e.messageType));
      webSocket.send(jsonResponse);
    } catch (ClientAlreadyExistsException e) {
      jsonResponse = this.serialize(this.generateMessage("Tried to add a client that already exists", e.messageType));
      webSocket.send(jsonResponse);
    } catch (IncorrectGameCodeException e) {
      jsonResponse = this.serialize(this.generateMessage("The provided gameCode was incorrect", e.messageType));
      webSocket.send(jsonResponse);
    } catch (InvalidOrbCoordinateException e) {
      jsonResponse = this.serialize(this.generateMessage("The provided orb coordinate was invalid", e.messageType));
      webSocket.send(jsonResponse);
    } catch (UserNoGameCodeException e) {
      jsonResponse = this.serialize(this.generateMessage("User had no corresponding game code", e.messageType));
      webSocket.send(jsonResponse);
    } catch (GameCodeNoGameStateException e) {
      jsonResponse = this.serialize(this.generateMessage("Game code had no corresponding game state", e.messageType));
      webSocket.send(jsonResponse);
    } catch (GameCodeNoLeaderboardException e) {
      jsonResponse = this.serialize(this.generateMessage("Game code had no corresponding leaderboard", e.messageType));
      webSocket.send(jsonResponse);
    } catch (SocketAlreadyExistsException e) {
      jsonResponse = this.serialize(this.generateMessage("This socket already exists", e.messageType));
      webSocket.send(jsonResponse);
    } catch (MissingGameStateException e) {
      jsonResponse = this.serialize(this.generateMessage("Game state cannot be found", e.messageType));
      webSocket.send(jsonResponse);
    } 
  }

  @Override
  public void onError(WebSocket connection, Exception e) {
    if (connection != null) {
      this.allConnections.remove(connection);
      System.out.println("server: An error occurred from: " + connection.getRemoteSocketAddress().getAddress().getHostAddress());
    }
  }

  @Override
  public void onStart() {
    System.out.println("server: Server started!");
  }

  public String serialize(Message message) {
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<Message> jsonAdapter = moshi.adapter(Message.class);
    return jsonAdapter.toJson(message);
  }

  private Message generateMessage(String msg, MessageType messageType) {
    Map<String, Object> data = new HashMap<>();
    data.put("msg", msg);
    return new Message(messageType, data);
  }

  public static void main(String args[]) {
    final int port = 9000;
    new SlitherServer(port).start();
  }

}
