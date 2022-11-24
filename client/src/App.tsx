import React from "react";
import logo from "./logo.svg";
import "./App.css";

const AppConfig = {
  PROTOCOL: "ws:",
  HOST: "//localhost",
  PORT: ":9000",
};

function registerSocket() {
  let socket: WebSocket = new WebSocket(
    AppConfig.PROTOCOL + AppConfig.HOST + AppConfig.PORT
  );

  socket.onopen = () => {
    console.log("client: A new client-side socket was opened!");
    socket.send(
      JSON.stringify({
        type: "NEW_CLIENT",
        data: "A new client socket was opened",
      })
    );
  };

  socket.onmessage = (response: MessageEvent) => {
    let message = JSON.parse(response.data);
    // ideally, we would want to do different things based on the message's type
    console.log("client: A message was received: " + response.data);
    if (message.type === "NO_REPLY") {
      console.log("client: A NO_REPLY message was received from the server");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "NO_REPLY",
        data: `The client received a message: ${message}`,
      })
    );
  };
}

function App() {
  registerSocket();
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
