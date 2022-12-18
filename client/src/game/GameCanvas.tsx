import { useEffect, Dispatch, SetStateAction } from "react";

import GameState, { Position } from "./GameState";
import Snake, { SnakeData, SNAKE_VELOCITY } from "./snake/Snake";
import Orb, { OrbData } from "./orb/Orb";
import Border from "./boundary/Boundary";
import OtherSnake from "./snake/OtherSnake";

import { sendUpdatePositionMessage } from "../message/message";

const canvasSize: Position = { x: 3000, y: 3000 };
const mousePos: Position = { x: 0, y: 0 };
const offset: Position = { x: 0, y: 0 };
// let lastUpdatedPosition: Position = { x: 0, y: 0 };
// let lastUpdatedTime: number = new Date().getTime();


interface GameCanvasProps {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  user: string,
  socket: WebSocket
}

/**
 * GameCanvas renders your snake in the middle of the screen, all the other
 * snakes in the game, all the existing orbs, and the border of the map.
 * @param param0
 * @returns
 */
export default function GameCanvas({gameState, setGameState, user, socket}: GameCanvasProps): JSX.Element {
  const onMouseMove = (e: MouseEvent) => {
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
  };

  const updatePositions = () => {
    const mySnake: SnakeData | undefined = gameState.snakes.get(user);
    if (mySnake !== undefined) {
      const newGameState: GameState = { ...gameState };
      const updatedSnake: SnakeData = moveSnake(mySnake, gameState, socket);
      // constantly update your own snake using moveSnake
      newGameState.snakes.set(user, updatedSnake);
      setGameState(newGameState);
    }
  };

  useEffect(() => {
    // updates position of the client's snake every 50 ms
    const interval = setInterval(updatePositions, 50);
    // updates mouse position when moved, determines target direction for snake
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      // clean up upon closing
      clearInterval(interval);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const mySnake: SnakeData | undefined = gameState.snakes.get(user);
  if (mySnake !== undefined) {
    const front: Position | undefined = mySnake.snakeBody.peekFront();
    if (front !== undefined) {
      // calculate offset to center snake and place other objects relative to snake
      offset.x = window.innerWidth / 2 - front.x;
      offset.y = window.innerHeight / 2 - front.y;
    }
  }

  return (
    <div>
      {Array.from(gameState.snakes.values()).map(
        (snake: SnakeData, ind: number) => (
          <Snake snake={snake} offset={offset} key={ind} />
        )
      )}
      {Array.from(gameState.orbs).map(
        (orb: OrbData, ind: number) => (
          <Orb orbInfo={orb} offset={offset} key={ind} />
        )
      )}
      <OtherSnake positions={gameState.otherBodies} offset={offset} /> //other
      snakes
      <Border boundaries={canvasSize} offset={offset} /> //map border
    </div>
  );
}

/**
 * function to move the snake based on mouse position
 * @param snake Positions that make up a snake
 * @param gameState Current gamestate
 * @param socket Socket to send updated position to backend through
 * @returns
 */
function moveSnake(snake: SnakeData,gameState: GameState, socket: WebSocket): SnakeData {
  const removePosition: Position | undefined = snake.snakeBody.pop(); //remove from the end
  const front: Position | undefined = snake.snakeBody.peekFront();
  if (front !== undefined) {
    const accel_angle: number = Math.atan2(
      //find the angle of acceleration based on your current position and the mouse position
      mousePos.y - offset.y - front.y,
      mousePos.x - offset.x - front.x
    );
    let vel_angle: number = Math.atan2(snake.velocityY, snake.velocityX);
    const angle_diff = mod(accel_angle - vel_angle, 2 * Math.PI);
    vel_angle += angle_diff < Math.PI ? 0.1 : -0.1;

    snake.velocityX = SNAKE_VELOCITY * Math.cos(vel_angle); //calculate a velocity at which to move the snake
    snake.velocityY = SNAKE_VELOCITY * Math.sin(vel_angle);

    const newPosition: Position = {
      x: front.x + snake.velocityX, //update position based on velocity
      y: front.y + snake.velocityY,
    };

    snake.snakeBody.unshift({ x: newPosition.x, y: newPosition.y }); // add new position to the front

    if (removePosition !== undefined) {
      const toAdd: Position = {
        x: Number(newPosition.x.toFixed(2)),
        y: Number(newPosition.y.toFixed(2)),
      };
      const toRemove: Position = {
        x: Number(removePosition.x.toFixed(2)),
        y: Number(removePosition.y.toFixed(2)),
      };
      sendUpdatePositionMessage(socket, toAdd, toRemove); //send message to server with add and remove positions
    }
  }
  return snake;
}

/**
 * Takes the modulo of the first argument by the second argument (n % m)
 * @param n the number whose modulo is being calculated
 * @param m the modulus of the operation
 */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
