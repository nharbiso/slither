package edu.brown.cs32.orb;

//import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import edu.brown.cs32.position.Position;

public class OrbGeneratorTest {
    OrbGenerator orbGenerator;

    @BeforeEach
    public void setup() {
        this.orbGenerator = new OrbGenerator();
    }

    @Test
    public void testEmptyOrbSetSize() {
        Set<Orb> gameOrbs = new HashSet<>();
        orbGenerator.generateOrbs(gameOrbs, 0);
        assertEquals(gameOrbs.size(), 150);
    }

    @Test
    public void testNonEmptyOrbSetSize() {
        Set<Orb> gameOrbs = new HashSet<>();
        Position position = new Position(3.5, 4.5);
        Orb orb = new Orb(position, OrbSize.LARGE, "red");
        gameOrbs.add(orb);
        orbGenerator.generateOrbs(gameOrbs, 0);
        assertEquals(gameOrbs.size(), 150);
    }

    @Test
    public void testDeathOrbSetSize() {
        Set<Orb> gameOrbs = new HashSet<>();
        orbGenerator.generateOrbs(gameOrbs, 100);
        assertEquals(gameOrbs.size(), 250);
    }


}
