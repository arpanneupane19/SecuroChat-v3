import React from "react";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import { io } from "socket.io-client";

const socket = io();

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={["/", "/home", "/create-room", "/create"]}>
          <CreateRoom socket={socket} />
        </Route>
        <Route exact path={["/join-room", "/join"]}>
          <JoinRoom socket={socket} />
        </Route>
        <Route exact path="/room/:code">
          <Room socket={socket} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
