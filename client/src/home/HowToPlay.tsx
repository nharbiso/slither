import React, { Dispatch, SetStateAction } from "react";
import "./HowToPlay.css";

export default function HowToPlay({
  setDisplayHowToPlay,
}: {
  setDisplayHowToPlay: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="how-to-play-container">
      <button className="cross" onClick={() => setDisplayHowToPlay(false)}>
        X
      </button>
      <h1 className="how-to-play-title">How to Play</h1>
      <ol>
        <li>
          Start playing a game
          <ul>
            <li>Click 'Create a new game' to start your own game</li>
          </ul>
          OR
          <ul>
            <li>
              Get a game code from a friend, enter it on the right, and click
              'Join with a game code' to play with them
            </li>
          </ul>
        </li>

        <li>
          In the game:
          <ul>
            <li>
              Move your mouse in the direction in which you want your snake to
              move
            </li>
            <li>Collect the shiny orbs to make your snake bigger</li>
            <li>
              Don't crash into other snakes or the red boundary to stay alive
            </li>
            <li>Grow to become the largest snake in the game!</li>
          </ul>
        </li>
      </ol>
    </div>
  );
}
