import Snake, { SnakeData, Position, SNAKE_VELOCITY } from "./Snake";
import { useEffect, useState, Dispatch, SetStateAction} from "react"
import "./SnakeCircle.css"
import Leaderboard from "../leaderboard/Leaderboard";

let mockLeaderboard = new Map<string, number>();
mockLeaderboard.set("player 1", 100);
mockLeaderboard.set("player 2", 32);


let mousePos: Position = {x: 0, y: 0};

export default function GameCanvas({snakes, setSnakes, mySnake}: {snakes: SnakeData[], setSnakes: Dispatch<SetStateAction<SnakeData[]>>, mySnake: number}) {
    const [mousePosState, setMousePos] = useState<Position>({x: 0, y: 0});

    const onMouseMove = (e: MouseEvent) => setMousePos({x: e.pageX, y: e.pageY});

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedSnake: SnakeData = moveSnake(snakes[mySnake]);
            setSnakes(snakes.splice(mySnake, 1, updatedSnake));
        }, 15);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', onMouseMove);
        }
    }, [])
    
    // const [left, setLeft] = useState("10px");
    // const [top, setTop] = useState("10px");

    // const onMouseMove = (e: any) =>{
    //     setLeft(e.pageX + 'px')
    //     setTop(e.pageY + "px")
    //   }

    // useEffect(() => {
    //     document.addEventListener('mousemove', onMouseMove);
    // }, [])
    //return <div style={{left: left, top: top}} />;


    useEffect(() => {
        mousePos = mousePosState;
    }, [mousePosState]);
    

    return (<div>
         {snakes.map((snake: SnakeData, ind: number) => <Snake snake={snake} key={ind} />)}
         <Leaderboard leaderboard={mockLeaderboard} />
    </div>)
}

function moveSnake(snake: SnakeData): SnakeData {
    snake.snakeBody.pop();
    const front: Position | undefined = snake.snakeBody.peekFront();
    if(front !== undefined) {
        const accel_angle: number = Math.atan2(mousePos.y - front.y, mousePos.x - front.x);
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