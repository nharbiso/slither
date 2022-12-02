import React from "react";
import OrbSize from "./orbSize";
import { Position } from "../GameState";
import "./orb.css";

export interface OrbData {
  position: Position;
  size: OrbSize;
}

export default function Orb({orbInfo, offset}: {orbInfo: OrbData, offset: Position}) {
  return (
    <div
      className="circle"
      style={{
        top: `${orbInfo.position.y + offset.y}px`,
        left: `${orbInfo.position.x + offset.x}px`,
        height: `${orbInfo.size === OrbSize.SMALL ? 7.5 : 11}px`,
        width: `${orbInfo.size === OrbSize.SMALL ? 7.5 : 11}px`,
      }}
    ></div>
  );
}
