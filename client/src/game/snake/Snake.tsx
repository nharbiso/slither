import Denque from 'denque';
import { Position } from '../GameState';
import "./Snake.css"

export interface SnakeData {
    snakeBody: Denque<Position>; //snake is a double ended queue so we can remove from the end and add to the front
    velocityX: number;
    velocityY: number;
}

export const SNAKE_VELOCITY = 8;

/**
 * A snake is a collection of positions. For each position, we render a circle
 * around that position (with an offset so that it remains in the middle of the
 * screen). 
 * @param param0 
 * @returns 
 */
export default function Snake({snake, offset}: {snake: SnakeData, offset: Position}) {
    return (
    <div>
        {snake.snakeBody.toArray().map((bodyPart: Position, ind: number) => 
            <div 
                className="snake"
                key={ind}
                style={{left: bodyPart.x + offset.x, top: bodyPart.y + offset.y}}
            />
        )}
    </div>        
    )
}
