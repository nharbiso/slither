import React from "react";
import "./GameCode.css";

/**
 * Renders the gamecode in the top left
 * @param param0 
 * @returns 
 */
export default function GameCode({gameCode} : {gameCode: string}) {
    return (
        <div id = "codeDisplay">
            <p id = "codeText">{gameCode}</p>
        </div>
    );
}