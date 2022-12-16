import React, { useState, Dispatch, SetStateAction } from "react";
import "./Home.css";

import { registerSocket } from "../game/Game";
import GameState from "../game/GameState";
import { OrbData } from "../game/orb/Orb";
import HowToPlay from "./HowToPlay";

/**
 * Defines an interface which specifies the types of the arguments accepted by
 * ControlledInput functional components.
 */
interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  className: string;
}

function ControlledInput({
  value,
  setValue,
  placeholder,
  className,
}: ControlledInputProps) {
  return (
    <input
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      placeholder={placeholder}
      className={className}
    ></input>
  );
}

interface HomeProps {
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  setScores: Dispatch<SetStateAction<Map<string, number>>>;
  setGameCode: Dispatch<SetStateAction<string>>;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  orbSet: Set<OrbData>;
}

/**
 * The homepage renders the how-to-play button to show instructions, an input box to
 * put your name into, a button to create a new game, or an input box and button to input an existing gamecode
 * @param param0 
 * @returns 
 */
export default function Home({
  setGameStarted,
  setScores,
  setGameCode,
  gameState,
  setGameState,
  orbSet,
}: HomeProps) {
  const [username, setUsername] = useState("");
  const [inputGamecode, setInputGamecode] = useState("");
  const [errorText, setErrorText] = useState("");
  const [displayHowToPlay, setDisplayHowToPlay] = useState(false);

  return (
    <div className="main-container">
      <div className="how-to-play-display">
        {displayHowToPlay ? (
          <HowToPlay setDisplayHowToPlay={setDisplayHowToPlay} />
        ) : null}
      </div>
      <div className="HomeContainer">
        <button
          className="btn btn-light how-to-play-button"
          onClick={() => setDisplayHowToPlay(true)}
        >
          How to play?
        </button>
        <h1 className="main-title">
          Slither<span className="title-plus">+</span>
        </h1>
        <h2 className="username-prompt">Enter your username:</h2>
        <ControlledInput
          value={username}
          setValue={setUsername}
          placeholder="Type your username here:"
          className="username-input"
        />
        <p className="error-text">{errorText}</p>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-5 col-sm-12">
              <button
                className="btn btn-light new-game-button"
                onClick={() => {
                  newGameClick(
                    setGameStarted,
                    setScores,
                    setErrorText,
                    setGameCode,
                    orbSet,
                    gameState,
                    setGameState,
                    username
                  );
                }}
              >
                Create a new game
              </button>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-12">
              <div className="or-text">OR</div>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-12">
              <h4 className="join-with-gamecode-text">Join with a game code</h4>
              <ControlledInput
                value={inputGamecode}
                setValue={setInputGamecode}
                placeholder="Enter gamecode here:"
                className="gamecode-input"
              />
              <br />
              <button
                className="btn btn-outline-light"
                onClick={() => {
                  withGameCodeClick(
                    setGameStarted,
                    setScores,
                    setErrorText,
                    setGameCode,
                    orbSet,
                    gameState,
                    setGameState,
                    username,
                    inputGamecode
                  );
                }}
              >
                Join with a game code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function newGameClick( //when we want to start a new game
  setGameStarted: Dispatch<SetStateAction<boolean>>,
  setScores: Dispatch<SetStateAction<Map<string, number>>>,
  setErrorText: Dispatch<SetStateAction<string>>,
  setGameCode: Dispatch<SetStateAction<string>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  username: string
) {
  if (username.trim().length === 0) { //check that the name is not empty
    setErrorText("Your username should be non-empty!");
    return;
  }
  setErrorText("");
  try {
    registerSocket(
      setScores,
      setGameStarted,
      setErrorText,
      setGameCode,
      orbSet,
      gameState,
      setGameState,
      username,
      false
    );
  } catch (e) { //check server status
    setErrorText("Error: Could not connect to server!");
  }
}

function withGameCodeClick( //when we want to join an existing game
  setGameStarted: Dispatch<SetStateAction<boolean>>,
  setScores: Dispatch<SetStateAction<Map<string, number>>>,
  setErrorText: Dispatch<SetStateAction<string>>,
  setGameCode: Dispatch<SetStateAction<string>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  username: string,
  gameCode: string
) {
  if (username.trim().length === 0) { //check that name is not empty
    setErrorText("Your username should be non-empty!");
    return;
  }
  setErrorText("");
  try {
    registerSocket(
      setScores,
      setGameStarted,
      setErrorText,
      setGameCode,
      orbSet,
      gameState,
      setGameState,
      username,
      true,
      gameCode
    );
  } catch (e) { //check server status
    setErrorText("Error: Could not connect to server!");
  }
}
