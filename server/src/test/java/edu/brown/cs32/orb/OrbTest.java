package edu.brown.cs32.orb;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import edu.brown.cs32.position.Position;

public class OrbTest {

    Position p1, p2, p3;
    Orb o1, o2, o3;

    @BeforeEach
    public void setup() {
        this.p1 = new Position(1.2, 3.2);
        this.p2 = new Position(3.5, 4.5);
        this.p3 = new Position(1.2, 3.2);
        this.o1 = new Orb(this.p1, OrbSize.SMALL, "red");
        this.o2 = new Orb(this.p2, OrbSize.LARGE, "red");
        this.o3 = new Orb(this.p3, OrbSize.LARGE, "red");
    }
    
    @Test
    public void testOrbEquality() {
        assertTrue(this.o1.equals(this.o3));
    }

    @Test
    public void testOrbInequality() {
        assertFalse(this.o1.equals(this.o2));
        assertFalse(this.o2.equals(this.o3));
    }

    @Test
    public void testEquivalentOrbHashing() {
        assertEquals(this.o1.hashCode(), this.o3.hashCode());
    }

    @Test
    public void testInequivalentOrbHashing() {
        assertNotEquals(this.o1.hashCode(), this.o2.hashCode());
        assertNotEquals(this.o2.hashCode(), this.o3.hashCode());
    }

    @Test
    public void testOrbGetSize() {
        assertEquals(o1.getSize(), OrbSize.SMALL);
        assertEquals(o2.getSize(), OrbSize.LARGE);
        assertEquals(o3.getSize(), OrbSize.LARGE);
    }

    @Test
    public void testOrbGetPosition() {
        assertEquals(o1.getPosition(), this.p1);
        assertEquals(o2.getPosition(), this.p2);
        assertEquals(o3.getPosition(), this.p3);
    }
}
