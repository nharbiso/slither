import React from "react";
import "./App.css";
import Game from "./game/Game";
import OrbSize from "./orb/orbSize";
import Orb, { OrbInfo } from "./orb/Orb";

const orbInfo: OrbInfo = { x: 100, y: 500, size: OrbSize.LARGE };

function App() {
  return (
    <div className="App">
      <Game />
      <Orb orbInfo={orbInfo} />
    </div>
  );
}

export default App;
