package edu.brown.cs32.gameState;

import edu.brown.cs32.position.Position;
import edu.brown.cs32.orb.Orb;
import edu.brown.cs32.orb.OrbGenerator;
import edu.brown.cs32.orb.OrbSize;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class GameState {

  private Set<Orb> orbs;
  private Set<Orb> deathOrbs; // only formed when people die
  private final int ORB_GENERATION_TIME_INTERVAL = 5;

  public GameState() {
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
    this.orbs = new OrbGenerator().generateOrbs(this.orbs);
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

}
