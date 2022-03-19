// App setup
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: { origin: "http://localhost:3000" },
});
const path = require("path");
const moment = require("moment");
const cors = require("cors");

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// {'roomName': ['userOne', 'userTwo']}
let roomToUsers = {};

// {'userOne': 'roomOne', 'userTwo': 'roomOne'}
let userToRoom = {};

// {'socketIdOne': ['userOne', 'roomName'], 'socketIdTwo': ['userTwo', 'roomName']}
let idToUserAndRoom = {};

let botName = "SecuroChat Bot";

app.get("/api/:code", (req, res) => {
  const code = parseInt(req.params.code);
  const codeExists = roomToUsers[code] ? true : false;
  res.json({ codeExists: codeExists });
});

io.on("connection", (socket) => {
  console.log("Made a connection.");

  socket.on("connectUser", ({ name, code }) => {
    /* 
    First check if the room exists.
    If it does, then check if the user is already in the room or not. If they are, then emit a rejoined event letting the current user
    know that they've rejoined the room.
    If they're not in the room, then add them to the room and emit a joined event letting other users in the room know that they have joined
    the chat room.

    If the room does not exist, then create the room and add the user(s) to the room.
    */
    if (code in roomToUsers) {
      // If user opens the same room in another tab
      if (roomToUsers[code].includes(name)) {
        socket.emit("rejoined");
        io.in(code).emit("connectionSuccessful", roomToUsers[code]);
      } else {
        // If room already exists, but user needs to be added.
        roomToUsers[code].push(name);
        userToRoom[name] = code;
        idToUserAndRoom[socket.id] = [name, code];
        socket.join(code);
        socket.to(code).emit("joined", name);
        io.in(code).emit("connectionSuccessful", roomToUsers[code]);
        socket.emit("botMessage", {
          sender: botName,
          message: `Welcome to the chat room. Feel free to chat privately.`,
          time: moment().format("h:mm a"),
        });
      }
    } else {
      // If room does not exist, then create the room and add the user(s) to the room.
      roomToUsers[code] = [];
      roomToUsers[code].push(name);
      userToRoom[name] = code;
      idToUserAndRoom[socket.id] = [name, code];
      socket.join(code);
      io.in(code).emit("connectionSuccessful", roomToUsers[code]);
      socket.emit("botMessage", {
        sender: botName,
        message: "Welcome to the chat room. Feel free to chat privately.",
        time: moment().format("h:mm a"),
      });
    }

    // Log the info to the console
    console.log(roomToUsers);
    console.log(userToRoom);
    console.log(idToUserAndRoom);
  });

  socket.on("message", ({ sender, message, time, room }) => {
    io.in(room).emit("message", {
      sender: sender,
      message: message,
      time: time,
    });
  });

  // If users of a room are requested from the frontend
  socket.on("requestUsers", (code) => {
    /* 
    The frontend will send the room code to the backend for the backend to send back the users in the room.
    */

    // Get users from the room code
    const users = roomToUsers[code];
    socket.emit("usersFromRequest", users);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
