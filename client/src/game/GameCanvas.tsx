import GameState, { Position } from './GameState';
import Snake, { SnakeData, SNAKE_VELOCITY } from './snake/Snake';
import Orb, { OrbData } from './orb/Orb';
import { useEffect, Dispatch, SetStateAction } from 'react'

const mousePos: Position = {x: 0, y: 0};
const offset: Position = {x: 0, y: 0};

export default function GameCanvas({gameState, setGameState, user}: {gameState: GameState, setGameState: Dispatch<SetStateAction<GameState>>, user: String}) {
    const onMouseMove = (e: MouseEvent) => {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const mySnake: SnakeData | undefined = gameState.snakes.get(user);
            if(mySnake !== undefined) {
                const newGameState: GameState = {...gameState};
                const updatedSnake: SnakeData = moveSnake(mySnake);
                newGameState.snakes.set(user, updatedSnake);
                setGameState(newGameState);
            }
        }, 15);
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', onMouseMove);
        }
    }, [])    

    const mySnake: SnakeData | undefined = gameState.snakes.get(user);
    if(mySnake !== undefined) {
        const front: Position | undefined = mySnake.snakeBody.peekFront();
        if(front !== undefined) {
            offset.x = (window.innerWidth / 2) - front.x;
            offset.y = (window.innerHeight / 2) - front.y;
        }
    }

    return (<div>
         {Array.from(gameState.snakes.values()).map((snake: SnakeData, ind: number) => <Snake snake={snake} offset={offset} key={ind} />)}
         {Array.from(gameState.orbs).map((orb: OrbData, ind: number) => <Orb orbInfo={orb} offset={offset} key={ind} />)}
    </div>);
}

function moveSnake(snake: SnakeData): SnakeData {
    snake.snakeBody.pop();
    const front: Position | undefined = snake.snakeBody.peekFront();
    if(front !== undefined) {
        const accel_angle: number = Math.atan2(mousePos.y - offset.y - front.y, mousePos.x - offset.x - front.x);
        let vel_angle: number = Math.atan2(snake.velocityY, snake.velocityX);
        const angle_diff = mod(accel_angle - vel_angle, 2 * Math.PI);
        vel_angle += angle_diff < Math.PI ? 0.1 : -0.1;

        snake.velocityX = SNAKE_VELOCITY * Math.cos(vel_angle);
        snake.velocityY = SNAKE_VELOCITY * Math.sin(vel_angle);

        snake.snakeBody.unshift({x: front.x + snake.velocityX, y: front.y + snake.velocityY});
    }
    return snake;
}

function mod(n : number, m: number): number {
    return ((n % m) + m) % m;
}