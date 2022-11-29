package edu.brown.cs32.actionHandlers;

import edu.brown.cs32.coordinate.Coordinate;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.gameState.GameState;
import edu.brown.cs32.message.Message;

public class RemoveOrbHandler {

  public boolean handleRemoveOrb(Message message, GameState gameState) throws MissingFieldException {
    if (!message.data().containsKey("x") || !message.data().containsKey("y"))
      throw new MissingFieldException(message);
    Coordinate coordinate = new Coordinate((float) message.data().get("x"), (float) message.data().get("y"));
    return gameState.removeOrb(coordinate);
  }

}
