package edu.brown.cs32.orb;

import edu.brown.cs32.position.Position;
import java.util.Objects;

public class Orb {

  private final Position position;
  private final OrbSize orbSize;
  private final String color;

  public Orb(Position position, OrbSize orbSize, String color) {
    this.position = position;
    this.orbSize = orbSize;
    this.color = color;
  }

  public Position getPosition() {
    return this.position;
  }

  public OrbSize getSize() {
    return this.orbSize;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || this.getClass() != o.getClass()) {
      return false;
    }
    Orb orb = (Orb) o;
    return this.position.equals(orb.position);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.position);
  }
}
