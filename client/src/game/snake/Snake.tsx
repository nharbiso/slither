import { useEffect } from "react";
import Denque from 'denque';
import { Position } from '../GameState';
import "./SnakeCircle.css"

export interface SnakeData {
    snakeBody: Denque<Position>;
    velocityX: number;
    velocityY: number;
}

export const SNAKE_VELOCITY = 5;

export default function Snake({snake, offset}: {snake: SnakeData, offset: Position}) {
    return (
    <div>
        {snake.snakeBody.toArray().map((bodyPart: Position, ind: number) => 
            <div className="snake" key={ind} style={{left: bodyPart.x + offset.x, top: bodyPart.y + offset.y}}/>)}
    </div>
        
        //for each snakebodypart, generate a circle around each coordinate
        //remove last element, add a new element to the front of the queue based on mouse position
        //either try to get it to just follow the mouse
        
    )
}
