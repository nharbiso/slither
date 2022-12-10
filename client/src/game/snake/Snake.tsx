import Denque from 'denque';
import { Position } from '../GameState';
import "./Snake.css"

export interface SnakeData {
    snakeBody: Denque<Position>;
    velocityX: number;
    velocityY: number;
}

// export const SNAKE_VELOCITY = 5;
export const SNAKE_VELOCITY = 8;

export default function Snake({snake, offset}: {snake: SnakeData, offset: Position}) {
    return (
    <div>
        {snake.snakeBody.toArray().map((bodyPart: Position, ind: number) => 
            <div className="snake" key={ind} style={{left: bodyPart.x + offset.x, top: bodyPart.y + offset.y}}/>)}
    </div>        
    )
}
