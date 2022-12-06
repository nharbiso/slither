import React from "react";
import { Position } from "../GameState";
import "./SnakeCircle.css";

export default function OtherSnake({
  positions,
  offset,
}: {
  positions: Set<string>;
  offset: Position;
}) {
  const parsedPositions: Set<Position> = new Set();
  positions.forEach((posString: string) => {
    parsedPositions.add(JSON.parse(posString));
  });
  return (
    <div>
      {Array.from(parsedPositions).map((bodyPart: Position) => (
        <div
          className="snake"
          style={{ left: bodyPart.x + offset.x, top: bodyPart.y + offset.y }}
        ></div>
      ))}
    </div>
  );
}
//this is probably a temporary render for other snake positions, just working with
//the current gamestate data to see if i can render other snakes and see if collision is detected properly
