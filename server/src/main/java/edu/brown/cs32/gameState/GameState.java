package edu.brown.cs32.gameState;

import edu.brown.cs32.coordinate.Coordinate;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.orb.Orb;
import edu.brown.cs32.orb.OrbGenerator;
import edu.brown.cs32.orb.OrbSize;
import edu.brown.cs32.server.SlitherServer;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class GameState {

  private SlitherServer slitherServer;
  private Set<Orb> orbs;
  private Set<Orb> deathOrbs; // only formed when people die
  private final OrbGenerator orbGenerator = new OrbGenerator();
  private final int ORB_GENERATION_TIME_INTERVAL = 5;

  public GameState(SlitherServer slitherServer) {
    this.slitherServer = slitherServer;
    this.orbs = new HashSet<Orb>();
    ScheduledThreadPoolExecutor exec = new ScheduledThreadPoolExecutor(1);
    exec.scheduleAtFixedRate(new Runnable() {
      public void run() {
        // code to execute repeatedly
        System.out.println("Try to generate orbs");
        GameState.this.generateOrb();
      }
    }, 0, this.ORB_GENERATION_TIME_INTERVAL, TimeUnit.SECONDS); // execute every 60 seconds
  }


  public void generateOrb() {
    this.orbGenerator.generateOrbs(this.orbs);
    this.sendOrbData();
  }

  public boolean removeOrb(Coordinate coordinate) {
    Orb removeOrb = new Orb(coordinate, OrbSize.SMALL); // OrbSize irrelevant for hash equality comparison
    if (!this.orbs.contains(removeOrb))
      return false;
    while (this.orbs.contains(removeOrb)) {
      this.orbs.remove(removeOrb);
    }
    return true;
  }

  public void sendOrbData() {
    Map<String, Object> orbData = new HashMap<>();
    orbData.put("orbSet", new HashSet<Orb>());
    String json = this.slitherServer.serialize(new Message(MessageType.SEND_ORBS, orbData));
    System.out.println("orb json");
    System.out.println(json);
    this.slitherServer.sendToAllGameStateConnections(this, json);
  }

}
