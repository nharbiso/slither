package edu.brown.cs32.actionHandlers;

import edu.brown.cs32.leaderboard.Leaderboard;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.user.User;

public class UserDiedHandler {

  public void handleUserDied(User user, Leaderboard leaderboard) {
    leaderboard.removeUser(user);
  }

}
