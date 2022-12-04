import React, { useState, Dispatch, SetStateAction } from "react";
import "./Home.css";

import { registerSocket } from "../game/Game";

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
}

export default function Home({ setGameStarted, setScores, setGameCode }: HomeProps) {
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
                newGameClick(setGameStarted, setScores, setErrorText, setGameCode, username);
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
  username: string
) {
  if (username.trim().length === 0) {
    setErrorText("Your username should be non-empty!");
    return;
  }
  setErrorText("");
  try {
    registerSocket(setScores, setGameStarted, setErrorText, setGameCode, username, false);
  } catch (e) {
    setErrorText("Error: Could not connect to server!");
  }
}

function withGameCodeClick(
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setScores: React.Dispatch<React.SetStateAction<Map<string, number>>>,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  setGameCode: React.Dispatch<React.SetStateAction<string>>,
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
      username,
      true,
      gameCode
    );
  } catch (e) {
    setErrorText("Error: Could not connect to server!");
  }
}
