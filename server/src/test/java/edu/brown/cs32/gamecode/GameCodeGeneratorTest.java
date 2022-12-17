package edu.brown.cs32.gamecode;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class GameCodeGeneratorTest {
    
    GameCodeGenerator gameCodeGenerator;
    Set<String> currGameCodes;

    @BeforeEach
    public void setup() {
        this.gameCodeGenerator = new GameCodeGenerator();
        this.currGameCodes = new HashSet<>();
    }

    @Test
    public void testGenerateGameCodeEmpty() {
        String newCode = this.gameCodeGenerator.generateGameCode(this.currGameCodes);
        assertEquals(newCode.length(), 6);
    }

    @Test
    public void testGenerateGameCodeNonEmpty() {
        this.currGameCodes.add("ABCDEF");
        String newCode = this.gameCodeGenerator.generateGameCode(this.currGameCodes);
        assertEquals(newCode.length(), 6);
    }

    @Test
    public void testAllUppercaseLetters() {
        String newCode = this.gameCodeGenerator.generateGameCode(this.currGameCodes);

        boolean isAllUppercase = true;

        for(int i=0; i<6; i++) {
            char currChar = newCode.charAt(i);
            int ascii = currChar;
            if(ascii < 65 || ascii > 90) {
                isAllUppercase = false;
            }
        }

        assertTrue(isAllUppercase);
    }

    @Test
    public void testNoOverlappingCodes() {
        this.currGameCodes.add("ABCDEF");
        boolean generatedRepeat = false;

        for(int i=0; i<100000000; i++) {
            String newCode = this.gameCodeGenerator.generateGameCode(this.currGameCodes);
            if(newCode.equals("ABCDEF")) {
                generatedRepeat = true;
            }
        }

        assertFalse(generatedRepeat);
    }
}
