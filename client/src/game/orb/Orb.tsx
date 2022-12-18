import OrbSize from "./orbSize";
import { Position } from "../GameState";
import "./orb.css";

export interface OrbData {
  position: Position;
  orbSize: OrbSize;
  color: string;
}

/**
 * Renders an orb using the given position, relative to the player's snake
 * (using offset)
 * @param param0 position and size of the orb and offset from player
 * @returns JSX element rendering an orb on teh screen
 */
export default function Orb({orbInfo, offset}: {orbInfo: OrbData, offset: Position}) {
  return (
    <div
      className="circle"
      style={{
        top: `${orbInfo.position.y + offset.y}px`,
        left: `${orbInfo.position.x + offset.x}px`,
        height: `${orbInfo.orbSize === OrbSize.SMALL ? 7.5 : 15}px`,
        width: `${orbInfo.orbSize === OrbSize.SMALL ? 7.5 : 15}px`,
        backgroundColor: `${orbInfo.color}`,
        boxShadow: `0 0 10px 1px ${orbInfo.color}`,
      }}
    ></div>
  );
}
