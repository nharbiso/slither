package edu.brown.cs32.actionHandlers;

import edu.brown.cs32.exceptions.MissingFieldException;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.user.User;

public class UpdateScoreHandler {

  public int handleScoreUpdate(Message message, User user) throws MissingFieldException {
    if (!message.data().containsKey("newScore"))
      throw new MissingFieldException(message, MessageType.ERROR);
    int newScore = (int) message.data().get("newScore");
    return newScore;
  }

}
