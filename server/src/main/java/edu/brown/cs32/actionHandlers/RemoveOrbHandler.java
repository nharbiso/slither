package edu.brown.cs32.actionHandlers;

import edu.brown.cs32.position.Position;
import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.gameState.GameState;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;

public class RemoveOrbHandler {

  public boolean handleRemoveOrb(Message message, GameState gameState) throws MissingFieldException {
    if (!message.data().containsKey("x") || !message.data().containsKey("y"))
      throw new MissingFieldException(message, MessageType.ERROR);
    Position position = new Position((float) message.data().get("x"), (float) message.data().get("y"));
    return gameState.removeOrb(position);
  }

}
