import React from "react";
import { Position } from "../GameState";
import "./SnakeCircle.css";

export default function OtherSnake({
  positions,
  offset,
}: {
  positions: Set<Position>;
  offset: Position;
}) {
  return (
    <div>
      {Array.from(positions).map((bodyPart: Position) => (
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
