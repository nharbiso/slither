package edu.brown.cs32.gamecode;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import edu.brown.cs32.gameState.GameState;
import edu.brown.cs32.message.Message;
import edu.brown.cs32.message.MessageType;
import edu.brown.cs32.server.SlitherServer;

public class GameCode {

    public static void sendGameCode(String gameCode, GameState gameState, SlitherServer slitherServer) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("gameCode", gameCode);
        Message message = new Message(MessageType.SET_GAME_CODE, map);
        String json = slitherServer.serialize(message);
        slitherServer.sendToAllGameStateConnections(gameState, json);
      }
}
