import React from "react";
import OrbSize from "./orbSize";

export interface OrbInfo {
    x: number;
    y: number;
    size: OrbSize;
}

export default function Orb({orbInfo}: {orbInfo: OrbInfo}) {
    return(
        <div className = "circle" style={{
            position: "absolute",
            top: `${orbInfo.y}px`,
            left: `${orbInfo.x}px`,
            height: `${orbInfo.size === OrbSize.SMALL ? 5 : 10}px`,
            width: `${orbInfo.size === OrbSize.SMALL ? 5 : 10}px`,
            borderRadius: "50%",
            backgroundColor: "red",
            boxShadow: "0 0 10px 1px red",
            opacity: "85%",
        }}>
        </div>
    )
}