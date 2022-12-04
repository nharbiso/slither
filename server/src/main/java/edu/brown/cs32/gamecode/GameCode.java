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
    private String gameCode;
    private GameState gameState;
    private SlitherServer slitherServer;

    public GameCode(String gameCode, GameState gameState, SlitherServer slitherServer) {
        this.gameCode = gameCode;
        this.gameState = gameState;
        this.slitherServer = slitherServer;

        ScheduledThreadPoolExecutor exec = new ScheduledThreadPoolExecutor(1);
        exec.scheduleAtFixedRate(new Runnable() {
            public void run() {
            // code to execute repeatedly
                System.out.println("TRY GAMECODE");
                //Map<String, Object> data = new HashMap<>();
                //Message message = new Message(MessageType.UPDATE_LEADERBOARD, data);
                GameCode.this.sendGameCode();
            }
        }, 1, 60, TimeUnit.SECONDS);

        sendGameCode();
        //sendGameCode(gameCode);
    }

    public void setGameCode(String gameCode) {
        this.gameCode = gameCode;
    }

    private void sendGameCode() {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("gameCode", this.gameCode);
        Message message = new Message(MessageType.SET_GAME_CODE, map);
        String json = this.slitherServer.serialize(message);
        this.slitherServer.sendToAllGameStateConnections(this.gameState, json);
      }
}
