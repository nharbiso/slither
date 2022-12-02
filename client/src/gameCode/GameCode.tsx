import React from "react";
import "./GameCode.css";

export default function GameCode({gameCode} : {gameCode: string}) {
    return (
        <div id = "codeDisplay">
            <p id = "codeText">{gameCode}</p>
        </div>
    );
}