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
const moment = require("moment");
const path = require("path");

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve the client build
app.use(express.static(path.join(__dirname, "../client/build")));

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

io.on("connection", (socket) => {
  console.log("Made a connection.");

  // When a user connects to a room
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
      /* 
        If user is already in room and is rejoining on another tab, then join the room and emit a rejoined event.
        In addition, add a new socketId to the idToUserAndRoom object.
        The conditional statement below does that.
        */
      if (roomToUsers[code].includes(name) && userToRoom[name] === code) {
        socket.join(code);
        idToUserAndRoom[socket.id] = [name, code];
        socket.emit("rejoined", "You have rejoined the room.");
      } else {
        // If room already exists, but user needs to be added.
        roomToUsers[code].push(name);
        userToRoom[name] = code;
        idToUserAndRoom[socket.id] = [name, code];
        socket.join(code);
        socket.to(code).emit("joinLeaveEvent", `${name} has joined the chat.`);
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
      socket.emit("botMessage", {
        sender: botName,
        message: "Welcome to the chat room. Feel free to chat privately.",
        time: moment().format("h:mm a"),
      });
    }
    // Update the active users indicator in the frontend
    io.in(code).emit("updateActiveUsers", roomToUsers[code]);

    // Log the info to the console
    console.log(roomToUsers);
    console.log(userToRoom);
    console.log(idToUserAndRoom);
  });

  // When a user sends a message, emit the message to the frontend.
  socket.on("message", ({ sender, message, time, room }) => {
    io.in(room).emit("message", {
      sender: sender,
      message: message,
      time: time,
    });
  });

  // If the frontend is requesting a list of active users in the room, then emit the list of active users to the frontend.
  socket.on("requestUsers", (code) => {
    // Get users from the room code
    const users = roomToUsers[code];
    socket.emit("usersFromRequest", users);
  });

  // When a user disconnects from a room
  socket.on("disconnect", (reason) => {
    // Get the socket id first.
    const socketId = socket.id;
    if (socketId in idToUserAndRoom) {
      // Get the name and room from socketId.
      const [name, room] = idToUserAndRoom[socketId];

      /* 
      Before removing the user and disconnecting them, first check if the user
      is still connected to the room on another tab by checking if other socketId's have the same name and room.
      First create a userCount to keep track of how many tabs are connected to the same room.
      */
      let userCount = 0;
      const allSocketIds = Object.keys(idToUserAndRoom);
      for (let i = 0; i < allSocketIds.length; i++) {
        if (
          idToUserAndRoom[allSocketIds[i]][0] === name &&
          idToUserAndRoom[allSocketIds[i]][1] === room
        ) {
          userCount++;
        }
      }

      /* 
      If the userCount is 1, then that means there was only one connection/tab open to the room.
      In this case, remove the user from the userToRoom and roomToUsers objects along with removing that socket id.
      */
      if (userCount == 1) {
        delete userToRoom[name];
        roomToUsers[room].splice(roomToUsers[room].indexOf(name), 1);
        delete idToUserAndRoom[socketId];
        // If the last user in the room leaves and the room becomes empty, delete the room.
        if (roomToUsers[room].length === 0) {
          delete roomToUsers[room];
        }
        socket.leave(room);
        io.in(room).emit("updateActiveUsers", roomToUsers[room]);
        io.in(room).emit("joinLeaveEvent", `${name} has left the chat.`);
      } else if (userCount > 1) {
        // If the userCount is greater than 1, then the user is still connected to the room on another tab.
        // In this case, remove the connected socket id from the idToUserAndRoom object.
        delete idToUserAndRoom[socketId];
        socket.leave(room);
      }

      // Log the info to the console.
      console.log(roomToUsers);
      console.log(userToRoom);
      console.log(idToUserAndRoom);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
