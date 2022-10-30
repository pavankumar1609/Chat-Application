const express = require("express");
const app = express();
const http = require("node:http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: ["http://localhost:3000"] },
});

const users = {};

io.on("connect", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", users[socket.id]);
  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", { message, name: users[socket.id] });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
