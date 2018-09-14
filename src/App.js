import React, { Component } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    const socket = io("http://localhost:8080");
    const sessionId = socket.io.engine.id;

    socket.on("connect", () => {
      socket.emit("newUser", { id: sessionId, name: "client" });
      console.log("Connected " + sessionId);
    });
    socket.on("newConnection", this.updateParticipants);
    socket.on("userDisconnected", this.handleUserDisconect);
    socket.on("incomingMessage", this.handleIncomingMessage);

    this.state = {
      sessionId,
      clientName: "client",
      participants: [],
      history: [],
      status: null
    };
  }

  updateParticipants = participants => {
    this.setState({ participants });
  };

  handleUserDisconect = data => {
    console.log("#" + data.id);
  };

  handleIncomingMessage = data => {
    const message = data.message;
    const name = data.name;

    this.setState(
      prevState => {
        return {
          history: [...prevState.history, { message, name }]
        };
      },
      () => console.log("history", this.state.history)
    );
  };

  handleMessageType = message => {
    const { clientName } = this.state;
    this.setState({ status: message }, () => {
      axios.post("http://localhost:8080/message", {
        message,
        name: clientName
      });
    });
  };

  render() {
    return (
      <div>
        <div />
        <div id="traffic-light">
          <input
            type="radio"
            name="traffic-light-color"
            id="color1"
            value="color1"
            checked={userType === "VIEWER"}
            onChange={() => this.handlePermission("STOP")}
          />
          <input
            type="radio"
            name="traffic-light-color"
            id="color2"
            value="color2"
            onChange={() => this.handlePermission("WARNING")}
          />
          <input
            type="radio"
            name="traffic-light-color"
            id="color3"
            value="color3"
            onChange={() => this.handlePermission("GO")}
          />
        </div>
      </div>
    );
  }
}

export default App;
