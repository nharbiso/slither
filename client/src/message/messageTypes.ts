enum MessageType {
  NEW_CLIENT_NO_CODE = "NEW_CLIENT_NO_CODE",
  NEW_CLIENT_WITH_CODE = "NEW_CLIENT_WITH_CODE",
  UPDATE_LEADERBOARD = "UPDATE_LEADERBOARD",
  SEND_ORBS = "SEND_ORBS",
  REMOVE_ORB = "REMOVE_ORB",
  UPDATE_SCORE = "UPDATE_SCORE",
  USER_DIED = "USER_DIED",
  SET_GAME_CODE = "SET_GAME_CODE",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  JOIN_ERROR = "JOIN_ERROR",
  JOIN_SUCCESS = "JOIN_SUCCESS",
  // Update this as more code is developed
}

export default MessageType;
