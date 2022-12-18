/**
 * A enum for the possible messages sent and received to the Slither+
 * server via a websocket.
 */
enum MessageType {
  NEW_CLIENT_NO_CODE = "NEW_CLIENT_NO_CODE",
  NEW_CLIENT_WITH_CODE = "NEW_CLIENT_WITH_CODE",
  UPDATE_LEADERBOARD = "UPDATE_LEADERBOARD",
  SEND_ORBS = "SEND_ORBS",
  REMOVE_ORB = "REMOVE_ORB",
  UPDATE_POSITION = "UPDATE_POSITION",
  UPDATE_SCORE = "UPDATE_SCORE",
  INCREASE_OWN_LENGTH = "INCREASE_OWN_LENGTH",
  INCREASE_OTHER_LENGTH = "INCREASE_OTHER_LENGHT",
  YOU_DIED = "YOU_DIED",
  OTHER_USED_DIED = "OTHER_USER_DIED",
  SET_GAME_CODE = "SET_GAME_CODE",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  JOIN_ERROR = "JOIN_ERROR",
  JOIN_SUCCESS = "JOIN_SUCCESS"
}

export default MessageType;
