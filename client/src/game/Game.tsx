import Denque from "denque"
import React, { useState } from "react"
import { SnakeData, Position, SNAKE_VELOCITY} from "./Snake"

import GameCanvas from "./GameCanvas"
import MessageType from "../message/messageTypes";
import { leaderboardData, leaderboardEntry } from "../message/message";
import Leaderboard from "../leaderboard/Leaderboard";

export default function Game({socket}: {socket: WebSocket}) {
    const snakeBody: Position[] = [];
    for(let i = 0; i < 100; i++) {
        snakeBody.push({x: 600, y: 100 + 5 * i});
    }
    const snake: SnakeData = {
        snakeBody: new Denque(snakeBody),
        velocityX: 0,
        velocityY: SNAKE_VELOCITY,
    }

    const [scores, setScores] = useState(new Map<string, number>());

    socket.onmessage = (response: MessageEvent) => {
        let message = JSON.parse(response.data);
        // ideally, we would want to do different things based on the message's type
        console.log("client: A message was received: " + response.data);
        switch (message.type) {
          case MessageType.UPDATE_LEADERBOARD: {
            const leaderboardMessage: leaderboardData = message;
            setScores(extractLeaderboardMap(leaderboardMessage.data.leaderboard));
          }
        }
      };

    const [snakes, setSnakes] = useState<SnakeData[]>([snake]);
    return (
        <div>
            <GameCanvas snakes={snakes} setSnakes={setSnakes} mySnake={0}/>
            <Leaderboard leaderboard={scores} />
        </div>
        //player's score
    )
}

function extractLeaderboardMap(leaderboardData: leaderboardEntry[]) {
    const leaderboard: Map<string, number> = new Map<string, number>();
    leaderboardData.forEach((entry: leaderboardEntry) => {
        leaderboard.set(entry.username, entry.score);
    })
    return leaderboard;
}

//here we want to take in gamestate data and load everything 
//i.e. load canvas, put snakes on top, render orbs, check mouse movements to move the snake, send data back to server, etc.
//essentially we should be calling everything from here

//Gamestate data -> passes info about snake, leaderboard, etc. to Game
//What does GameCanvas need? -> position of everybody else's snake (maybe as an array idk)
//For each snake that is given to gamecanvas, render a snake component
//We should also store a double ended queue in GameCanvas that represents your own snake, the window should always center around this snake
//
//Each snake component is a double ended queue of SnakeBodyparts that have an x, y coordinate
//

//CURRENT GOAL IS TO TRY TO GET A COLLECTION OF RENDERED CIRCLES THAT FOLLOW MOUSE