package edu.brown.cs32.orb;

import edu.brown.cs32.coordinate.Coordinate;
import java.util.Objects;
import java.util.Set;

public class Orb {

  private final Coordinate coordinate;
  private final OrbSize orbSize;

  public Orb(Coordinate coordinate, OrbSize orbSize) {
    this.coordinate = coordinate;
    this.orbSize = orbSize;
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
    return this.coordinate.equals(orb.coordinate);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.coordinate);
  }
}
