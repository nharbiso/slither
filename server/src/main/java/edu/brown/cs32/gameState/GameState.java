package edu.brown.cs32.gameState;

import edu.brown.cs32.coordinate.Coordinate;
import edu.brown.cs32.orb.Orb;
import edu.brown.cs32.orb.OrbSize;
import java.util.HashSet;
import java.util.Set;

public class GameState {

  Set<Orb> orbs;

  public GameState() {
    this.orbs = new HashSet<Orb>();
  }

  public boolean removeOrb(Coordinate coordinate) {
    Orb removeOrb = new Orb(coordinate, OrbSize.SMALL); // OrbSize irrelevant for hash equality comparison
    if (!this.orbs.contains(removeOrb))
      return false;
    while (true) {
      if (!this.orbs.contains(removeOrb))
        break;
      this.orbs.remove(removeOrb);
    }
    return true;
  }

}
