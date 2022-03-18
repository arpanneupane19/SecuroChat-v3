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
let roomToUsers = new Map();

// {'userOne': 'roomOne', 'userTwo': 'roomOne'}
let userToRoom = new Map();

// {'socketIdOne': 'userOne', 'socketIdTwo': 'userTwo'}
let idToUser = new Map();

app.get("/api/:code", (req, res) => {
  const code = req.params.code;
  const codeExists = roomToUsers.has(code);
  /* 
  If the room code exists, send the response with the codeExists property set to true along with the users in the room.
  If the room code does not exist, send the response with the codeExists property set to false.
  */
  if (codeExists) {
    res.json({ codeExists: codeExists, users: roomToUsers.get(code) });
  } else {
    res.json({ codeExists: codeExists });
  }
});

io.on("connection", (socket) => {
  console.log("Made a connection.");

  // Creating rooms
  socket.on("createRoom", ({ name, code }) => {
    /* 
    The frontend will send the name and the room code to the backend for the backend to create the room.
    The roomToUsers, userToRoom, and idToUser maps will be updated with the new room and user (socket ID for idToUser).
    Once that happens, the backend will emit an event that lets the frontend know that the user has connected to the room.
    */
    roomToUsers.set(code, [name]);
    userToRoom.set(name, code);
    idToUser.set(socket.id, name);
    socket.join(code);
    console.log(`${name} created room ${code}`);
    console.log(roomToUsers);
    console.log(userToRoom);
    console.log(idToUser);
    socket.emit("createdRoomSuccessfully", { name });
    socket.emit("botChat", {
      sender: "SecuroChat Bot",
      message: `Hello ${name}, welcome to SecuroChat. Here, you can chat freely without worrying about privacy. Start the conversation!`,
      time: moment().format("h:mm a"),
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
