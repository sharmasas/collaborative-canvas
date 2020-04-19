// requires package express
var express = require("express");
var app = express();
// listening on port set by app
const port = process.env.PORT | 3000;
var server = app.listen(port);

// hosting static files in public directory
app.use(express.static("public"));

console.log("server is running");

// require socket.io
var socket = require("socket.io");
// calling function socket with variable server
var io = socket(server);

// event 1: if I have a new connection
io.sockets.on("connection", newConnection);
io.sockets.on("disconnect", 

function newConnection(socket) {
  console.log("new connection: " + socket.id);

  socket.on("mouse", mouseMsg);

  function mouseMsg(data) {
    //returns to specific socket
    socket.broadcast.emit("mouse", data);
    //returns to all sockets including your own
    //io.sockets.emit('mouse', data);
    console.log(data);
  }
}
