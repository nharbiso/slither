import Denque from "denque"
import React from "react"
import { SnakeBodypart } from "./SnakeBodypart"

import GameCanvas from "./GameCanvas"

const sbp1: SnakeBodypart = {
    x: 1,
    y: 1,
};
const sbp2: SnakeBodypart = {
    x: 2,
    y: 2,
};
const sbp3: SnakeBodypart = {
    x: 3,
    y: 3,
};

//request data from server, server will give gamestate data

let mockGameState = {snakes: [new Denque([sbp1, sbp2, sbp3])]}

export default function Game() {
    return (
        <GameCanvas snakes={mockGameState.snakes}/>
        //leaderboard
        //player's score
    )
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