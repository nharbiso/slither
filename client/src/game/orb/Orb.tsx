import React from "react";
import OrbSize from "./orbSize";
import { Position } from "../GameState";
import "./orb.css";

export interface OrbData {
  x: number;
  y: number;
  size: OrbSize;
}

export default function Orb({orbInfo, offset}: {orbInfo: OrbData, offset: Position}) {
  return (
    <div
      className="circle"
      style={{
        top: `${orbInfo.y + offset.y}px`,
        left: `${orbInfo.x + offset.x}px`,
        height: `${orbInfo.size === OrbSize.SMALL ? 7.5 : 11}px`,
        width: `${orbInfo.size === OrbSize.SMALL ? 7.5 : 11}px`,
      }}
    ></div>
  );
}
