import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  sendNewClientWithCodeMessage,
  sendNewClientNoCodeMessage,
} from "./message/message";
import Game from "./game/Game";
import OrbSize from "./orb/orbSize";
import Orb, { OrbInfo } from "./orb/Orb"

const AppConfig = {
  PROTOCOL: "ws:",
  HOST: "//localhost",
  PORT: ":9000",
};

let toregister: boolean = true;

function registerSocket() {
  let socket: WebSocket = new WebSocket(
    AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT
  );

  socket.onopen = () => {
    console.log("client: A new client-side socket was opened!");
    // TODO: random string username for now; pass user chosen username later); also pass chosen game code later
    sendNewClientNoCodeMessage(socket, (Math.random() * 1000).toString());
    // sendNewClientWithCodeMessage(
    //   socket,
    //   (Math.random() * 1000).toString(),
    //   "123456"
    // );
  };

  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
    // ideally, we would want to do different things based on the message's type
    console.log("client: A message was received: " + response.data);
  };
}

const orbInfo: OrbInfo = { x: 100, y: 500, size: OrbSize.LARGE };

function App() {
  useEffect(() => {
    if (!toregister) {
      return;
    }
    toregister = false;
    registerSocket();
  }, []);
  // registerSocket();

  return (
    <div className="App">
        <Game/>
        <Orb orbInfo={orbInfo} />
      </header>
    </div>
  );
}

export default App;
