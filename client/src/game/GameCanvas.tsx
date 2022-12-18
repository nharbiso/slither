import GameState, { Position } from "./GameState";
import Snake, { SnakeData, SNAKE_VELOCITY } from "./snake/Snake";
import Orb, { OrbData } from "./orb/Orb";
import Border from "./boundary/Boundary";
import OtherSnake from "./snake/OtherSnake";
// import { formControlUnstyledClasses } from '@mui/base';
import { sendUpdatePositionMessage } from "../message/message";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

const canvasSize: Position = { x: 3000, y: 3000 };
const mousePos: Position = { x: 0, y: 0 };
const offset: Position = { x: 0, y: 0 };
// let lastUpdatedPosition: Position = { x: 0, y: 0 };
let lastUpdatedTime: number = new Date().getTime();

/**
 * GameCanvas renders your snake in the middle of the screen, all the other
 * snakes in the game, all the existing orbs, and the border of the map.
 * @param param0
 * @returns
 */
export default function GameCanvas({
  gameState,
  setGameState,
  user,
  socket,
}: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  user: String;
  socket: WebSocket;
}) {
  const onMouseMove = (e: MouseEvent) => {
    mousePos.x = e.pageX; //locate mouse position
    mousePos.y = e.pageY;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      //on an interval, we want to make updates, we set it to 50
      const mySnake: SnakeData | undefined = gameState.snakes.get(user);
      if (mySnake !== undefined) {
        const newGameState: GameState = { ...gameState };
        const updatedSnake: SnakeData = moveSnake(mySnake, gameState, socket);
        //constantly update your own snake using moveSnake
        newGameState.snakes.set(user, updatedSnake);
        setGameState(newGameState);
      }
    }, 50);
    window.addEventListener("mousemove", onMouseMove); //check mouse movement

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", onMouseMove); //need to remove mouse event listener on interval
    };
  }, []);

  const mySnake: SnakeData | undefined = gameState.snakes.get(user);
  if (mySnake !== undefined) {
    const front: Position | undefined = mySnake.snakeBody.peekFront();
    if (front !== undefined) {
      //calculate offset to center snake and place other objects relative to snake
      offset.x = window.innerWidth / 2 - front.x;
      offset.y = window.innerHeight / 2 - front.y;
    }
  }

  return (
    <div>
      {Array.from(gameState.snakes.values()).map(
        //your snake
        (snake: SnakeData, ind: number) => (
          <Snake snake={snake} offset={offset} key={ind} />
        )
      )}
      {Array.from(gameState.orbs).map(
        (
          orb: OrbData,
          ind: number //orbs
        ) => (
          <Orb orbInfo={orb} offset={offset} key={ind} />
        )
      )}
      <OtherSnake positions={gameState.otherBodies} offset={offset} />
      <Border boundaries={canvasSize} offset={offset} />
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
function moveSnake(
  snake: SnakeData,
  gameState: GameState,
  socket: WebSocket
): SnakeData {
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

    snake.snakeBody.unshift({ x: newPosition.x, y: newPosition.y }); //add new position to the front

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

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function distance(pos1: Position, pos2: Position): number {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}
