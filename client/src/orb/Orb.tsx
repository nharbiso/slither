import React from "react";
import OrbSize from "./orbSize";
import "./orb.css";

export interface OrbInfo {
  x: number;
  y: number;
  size: OrbSize;
}

export default function Orb({ orbInfo }: { orbInfo: OrbInfo }) {
  return (
    <div
      className="circle"
      style={{
        top: `${orbInfo.y}px`,
        left: `${orbInfo.x}px`,
        height: `${orbInfo.size === OrbSize.SMALL ? 7.5 : 11}px`,
        width: `${orbInfo.size === OrbSize.SMALL ? 7.5 : 11}px`,
      }}
    ></div>
  );
}