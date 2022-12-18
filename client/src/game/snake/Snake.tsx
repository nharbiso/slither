import Denque from 'denque';
import "./Snake.css"
import { Position } from '../GameState';

/** A metadata representation of a snake */
export interface SnakeData {
    /** 
     * A collection of positions, specifying the locations of the 
     * circles making up the snake's body
     */
    snakeBody: Denque<Position>;
    /** The velocity of the snake in the horizontal direction */
    velocityX: number;
    /** The velocity of the snake in the vertical direction */
    velocityY: number;
}

export const SNAKE_VELOCITY = 8;

/**
 * Renders the given snake, represented by its metadata, on screen at the 
 * given position offset; a snake is rendered as a consecutive collection of circles
 * @param snake a metadata representation of a snake
 * @param offset the offset at which the snake is to be rendered
 * @returns a rendered snake
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
