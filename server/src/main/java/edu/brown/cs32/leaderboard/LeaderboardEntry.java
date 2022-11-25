package edu.brown.cs32.leaderboard;

import edu.brown.cs32.user.User;

public record LeaderboardEntry(User user, Integer score) {}
