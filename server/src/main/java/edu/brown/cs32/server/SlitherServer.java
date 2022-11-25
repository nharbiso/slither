package edu.brown.cs32.server;

import java.net.InetSocketAddress;
import java.util.HashSet;
import java.util.Set;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class SlitherServer extends WebSocketServer {

  Set<WebSocket> activeConnections;

  public SlitherServer(int port) {
    super(new InetSocketAddress(port));
    this.activeConnections = new HashSet<>();
  }

  private void sendToAllConnections(String messageJson) {
    for (WebSocket webSocket : this.activeConnections) {
      webSocket.send(messageJson);
    }
  }

  @Override
  public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
    System.out.println("server: onOpen called");
    this.activeConnections.add(webSocket);
    System.out.println("server: New client joined - Connection from " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    System.out.println("server: new activeConnections: " + this.activeConnections);
    String messageJson = "{\"type\": \"NEW_CLIENT\", \"data\": \"welcome, client!\"}";
    webSocket.send(messageJson);
  }

  @Override
  public void onClose(WebSocket webSocket, int code, String reason, boolean remote) {
    System.out.println("server: onClose called");
    this.activeConnections.remove(webSocket);
    System.out.println("server: reduced activeConnections: " + this.activeConnections);
  }

  @Override
  public void onMessage(WebSocket webSocket, String message) {
    System.out.println("server: Message received from client: " + message);
    // can deserialize the message with Moshi (if required)
    // ideally, we would want to do different things based on the message's type
    webSocket.send("{\"data\": \"Message received\", \"type\": \"NO_REPLY\"}");
  }

  @Override
  public void onError(WebSocket connection, Exception e) {
    if (connection != null) {
      this.activeConnections.remove(connection);
      System.out.println("server: An error occurred from: " + connection.getRemoteSocketAddress().getAddress().getHostAddress());
    }
  }

  @Override
  public void onStart() {
    System.out.println("server: Server started!");
  }

  public static void main(String args[]) {
    final int port = 9000;
    new SlitherServer(port).start();
  }

}
