package edu.brown.cs32.orb;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class OrbColorTest {
    
    @Test
    public void testRandomOrbColor() {
        assertEquals(OrbColor.generate().length(), 7);
    }

    @Test
    public void testOrbColorLeadingHashtag() {
        assertEquals(OrbColor.generate().substring(0,1), "#");
    }
}
