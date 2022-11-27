package edu.brown.cs32.server;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import edu.brown.cs32.actionHandlers.NewClientHandler;
import edu.brown.cs32.actionHandlers.UpdateScoreHandler;
import edu.brown.cs32.actionHandlers.UserDiedHandler;
import edu.brown.cs32.exceptions.ClientAlreadyExistsException;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.exceptions.NoUserException;
import edu.brown.cs32.leaderboard.Leaderboard;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.user.User;
import java.io.IOException;
import java.net.InetSocketAddress;
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
  private final Leaderboard leaderboard;
  private final Map<WebSocket, User> socketToUser;

  public SlitherServer(int port) {
    super(new InetSocketAddress(port));
    this.allConnections = new HashSet<>();
    this.inactiveConnections = new HashSet<>();
    this.leaderboard = new Leaderboard();
    this.socketToUser = new HashMap<>();
  }

  public Set<WebSocket> getAllConnections() {
    return new HashSet<>(this.allConnections);
  }

  public Set<WebSocket> getInactiveConnections() {
    return new HashSet<>(this.inactiveConnections);
  }

  private void sendToAllActiveConnections(String messageJson) {
    for (WebSocket webSocket : this.allConnections) {
      if (this.inactiveConnections.contains(webSocket))
        continue;
      webSocket.send(messageJson);
    }
  }

  public boolean addWebsocketUser(WebSocket websocket, User user) {
    if (this.socketToUser.containsKey(websocket))
      return false;
    this.socketToUser.put(websocket, user);
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
    System.out.println("server: reduced activeConnections: " + this.allConnections);
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
        case NEW_CLIENT -> {
          // TODO: Need to update this case to include the stuff with the game code (note: each game
          //  would need its own leaderboard so need to account for that too)
          this.inactiveConnections.remove(webSocket);
          User newUser = new NewClientHandler().handleNewClient(deserializedMessage, webSocket, this);
          this.leaderboard.addNewUser(newUser);
          jsonResponse = this.serialize(this.generateMessage("New client added", MessageType.SUCCESS));
          webSocket.send(jsonResponse);
          break;
        }
        case UPDATE_SCORE -> {
          User user = this.socketToUser.get(webSocket);
          if (user == null)
            throw new NoUserException(deserializedMessage.type());
          int newScore = new UpdateScoreHandler().handleScoreUpdate(deserializedMessage, user);
          this.leaderboard.updateScore(user, newScore);
          jsonResponse = this.serialize(this.generateMessage("Score updated", MessageType.SUCCESS));
          webSocket.send(jsonResponse);
          break;
        }
        case USER_DIED -> {
          User user = this.socketToUser.get(webSocket);
          if (user == null)
            throw new NoUserException(deserializedMessage.type());
          new UserDiedHandler().handleUserDied(user, this.leaderboard);
          this.inactiveConnections.add(webSocket);
          jsonResponse = this.serialize(this.generateMessage("User removed from leaderboard", MessageType.SUCCESS));
          webSocket.send(jsonResponse);
          break;
        }
        default -> {
          jsonResponse = this.serialize(this.generateMessage("The message sent by the client had an unexpected type", MessageType.ERROR));
          webSocket.send(jsonResponse);
          break;
        }
      }
    } catch (IOException e) {
      jsonResponse = this.serialize(this.generateMessage("The server could not deserialize the client's message", MessageType.ERROR));
      webSocket.send(jsonResponse);
    } catch (MissingFieldException e) {
      jsonResponse = this.serialize(this.generateMessage("The message sent by the client was missing a required field", MessageType.ERROR));
      webSocket.send(jsonResponse);
    } catch (NoUserException e) {
      jsonResponse = this.serialize(this.generateMessage("An operation requiring a user was tried before the user existed", MessageType.ERROR));
      webSocket.send(jsonResponse);
    } catch(ClientAlreadyExistsException e) {
      jsonResponse = this.serialize(this.generateMessage("Tried to add a client that already exists", MessageType.ERROR));
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

  private String serialize(Message message) {
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
