package edu.brown.cs32.orb;

//import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class OrbGeneratorTest {
    OrbGenerator orbGenerator;

    @BeforeEach
    public void setup() {
        this.orbGenerator = new OrbGenerator();
    }
}
