import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { sendNewClientMessage } from "./message/message";

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
    sendNewClientMessage(socket, (Math.random() * 1000).toString()); // TODO: random string for now; pass user chosen username later)
  };

  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
    // ideally, we would want to do different things based on the message's type
    console.log("client: A message was received: " + response.data);
  };
}

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
