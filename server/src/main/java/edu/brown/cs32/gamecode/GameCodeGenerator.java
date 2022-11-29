package edu.brown.cs32.gamecode;

import java.util.Random;
import java.util.Set;

public class GameCodeGenerator {

  private String createGameCode() {
    Random random = new Random();
    String gameCode = "";
    for (int i = 0; i < 6; i++)
      gameCode += (char) (random.nextInt(97, 123));
    return gameCode;
  }

  public String generateGameCode(Set<String> existingGameCodes) {
    String gameCode = this.createGameCode();
    while (existingGameCodes.contains(gameCode)) {
      gameCode = this.createGameCode();
    }
    return gameCode;
  }

}
