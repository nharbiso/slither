package edu.brown.cs32.orb;

import edu.brown.cs32.position.Position;
import java.util.Random;
import java.util.Set;

public class OrbGenerator {

  final int MAX_ORB_COUNT = 500;
  final float MAP_MIN_COORDINATE = 0.0f + 200.0f;
  final float MAP_MAX_COORDINATE = 1000.0f - 200.0f;

  private float round(float value) {
    return Math.round(value * 100) / 100.0f;
  }

  public void generateOrbs(Set<Orb> orbs) {
    Random random = new Random();
    int size = orbs.size();
    for (int i = 0; i < this.MAX_ORB_COUNT - size; i++) {
      Orb orb = new Orb(new Position(this.round(random.nextFloat(this.MAP_MIN_COORDINATE, this.MAP_MAX_COORDINATE)),
                                       this.round(random.nextFloat(this.MAP_MIN_COORDINATE, this.MAP_MAX_COORDINATE))),
                        this.generateOrbSize());
      orbs.add(orb);
    }
  }

  private OrbSize generateOrbSize() {
    // 75% -- small; 25% -- large
    Random random = new Random();
    if (random.nextFloat() <= 0.75)
      return OrbSize.SMALL;
    return OrbSize.LARGE;
  }

}
