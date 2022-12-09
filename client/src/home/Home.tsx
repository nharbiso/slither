import React, { useState, Dispatch, SetStateAction } from "react";
import "./Home.css";

import { registerSocket } from "../game/Game";
import GameState from "../game/GameState";
import { OrbData } from "../game/orb/Orb";

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
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  setGameCode: React.Dispatch<React.SetStateAction<string>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  orbSet: Set<OrbData>;
}

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

  return (
    <div className="HomeContainer">
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
            <h4>Join with a game code</h4>
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
  );
}

function newGameClick(
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  setGameCode: React.Dispatch<React.SetStateAction<string>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  username: string
) {
  if (username.trim().length === 0) {
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
  } catch (e) {
    setErrorText("Error: Could not connect to server!");
  }
}

function withGameCodeClick(
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  setGameCode: React.Dispatch<React.SetStateAction<string>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  username: string,
  gameCode: string
) {
  if (username.trim().length === 0) {
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
  } catch (e) {
    setErrorText("Error: Could not connect to server!");
  }
}
