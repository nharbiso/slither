package edu.brown.cs32.leaderboard;

import edu.brown.cs32.gameState.GameState;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.server.SlitherServer;
import edu.brown.cs32.user.User;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class Leaderboard {

  private final Map<User, Integer> userScores;
  private final int LEADERBOARD_UPDATE_INTERVAL = 5;
  private final GameState gameState;
  private final SlitherServer slitherServer;

  public Leaderboard(GameState gameState, SlitherServer slitherServer) {
    this.userScores = new HashMap<User, Integer>();
    this.gameState = gameState;
    this.slitherServer = slitherServer;

    ScheduledThreadPoolExecutor exec = new ScheduledThreadPoolExecutor(1);
    exec.scheduleAtFixedRate(new Runnable() {
      public void run() {
        // code to execute repeatedly
        System.out.println("Try to generate leaderboard");
        LeaderboardEntry[] newLeaderboard = Leaderboard.this.getLeaderboard();
        Map<String, Object> data = new HashMap<>();
        data.put("leaderboard", newLeaderboard);
        Message message = new Message(MessageType.UPDATE_LEADERBOARD, data);
        Leaderboard.this.sendLeaderboardScores(message);
      }
    }, 1, this.LEADERBOARD_UPDATE_INTERVAL, TimeUnit.SECONDS); // execute every 60 seconds
  }

  private void sendLeaderboardScores(Message message) {
    String json = this.slitherServer.serialize(message);
    System.out.println("Leaderboard json");
    System.out.println(json);
    this.slitherServer.sendToAllGameStateConnections(this.gameState, json);
  }

  /**
   * Add a provided User to the leaderboard (userScores). The initial score assigned to the new
   * User is 0.
   *
   * @param user - A reference to the new User that needs to be added to the leaderboard.
   * @return true if the user was added to the leaderboard; if the user already exists
   * on the leaderboard then false is returned and no changes are made.
   */
  public boolean addNewUser(User user) {
    if (this.userScores.containsKey(user)) {
      return false;
    }
    this.userScores.put(user, 20);
    return true;
  }

  /**
   * Removes a user from the leaderboard (userScores).
   *
   * @param user - A reference ot the User to be removed from the leaderboard.
   * @return true if the user was removed from the leaderboard; false if this was not possible (if
   * the user did not exist on the leaderboard to begin with).
   */
  public boolean removeUser(User user) {
    if (this.userScores.containsKey(user)) {
      this.userScores.remove(user);
      return true;
    }
    return false;
  }

  /**
   * Updates the score for a specific user on the leaderboard (userScores).
   *
   * @param user - A reference to the User whose score has to be updated.
   * @param newScore - The new score to be assigned to the User.
   * @return true if the user's score was updated; false if the score could not be updated (if the
   * User did not exist on the leaderboard to begin with).
   */
  public boolean updateScore(User user, Integer newScore) {
    if (this.userScores.containsKey(user)) {
      this.userScores.put(user, newScore);
      return true;
    }
    return false;
  }

  // TODO: consider some caching strategy or regularly timed server calls at which updated data is broadcast
  //  to all clients to prevent the need for repeatedly forming and sorting the leaderboard array

  /**
   * Gets the current leaderboard standings for all the players who are currently playing.
   *
   * @return an array of LeaderboardEntry's -- sorted in decreasing order of user scores.
   */
  public LeaderboardEntry[] getLeaderboard() {
    LeaderboardEntry[] leaderboard = new LeaderboardEntry[this.userScores.size()];
    int i = 0;
    for (User user : this.userScores.keySet()) {
      leaderboard[i] = new LeaderboardEntry(user, this.userScores.get(user));
      i++;
    }
    Arrays.sort(leaderboard, new Comparator<LeaderboardEntry>() {
      @Override
      public int compare(LeaderboardEntry o1, LeaderboardEntry o2) {
        return o1.score().compareTo(o2.score());
      }
    });
    return leaderboard;
  }
}
