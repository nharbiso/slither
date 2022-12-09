package edu.brown.cs32.gameState;

import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.position.Position;
import edu.brown.cs32.orb.Orb;
import edu.brown.cs32.orb.OrbGenerator;
import edu.brown.cs32.orb.OrbSize;
import edu.brown.cs32.server.SlitherServer;
import edu.brown.cs32.user.User;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import org.java_websocket.WebSocket;

public class GameState {

  private SlitherServer slitherServer;
  private Set<Orb> orbs;
  private Set<Orb> deathOrbs; // only formed when people die
  private final OrbGenerator orbGenerator = new OrbGenerator();
  private final int ORB_GENERATION_TIME_INTERVAL = 5;
  private Map<User, Set<Position>> userToOthersPositions;

  public GameState(SlitherServer slitherServer) {
    this.slitherServer = slitherServer;
    this.orbs = new HashSet<Orb>();
    this.userToOthersPositions = new HashMap<>();
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

  public void generateOrb() {
    this.orbGenerator.generateOrbs(this.orbs);
  }

  public boolean removeOrb(Position position) {
    Orb removeOrb = new Orb(position, OrbSize.SMALL); // OrbSize irrelevant for hash equality comparison
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

    System.out.println("orb json");
    
    this.slitherServer.sendToAllGameStateConnections(this, json);
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

}
