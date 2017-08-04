"use strict";
//
// SocketServer.js
//
// We send events via SocketIO to each client.
//

const http = require("http");
const child_process = require("child_process");

const SocketIO = require("socket.io");
const SocketIOClient = require("socket.io-client");

const config = require("../config/");


// -------- Server Socket --------
var server = http.Server();
var io = SocketIO(server);


// Delay start of the public api a bit, to make sure we cached each line
setTimeout(function(){
  server.listen(config.network.port, config.network.address);
}, 2000);
server.on("listening", function() {
  process.send({type: "init"});
  console.info("DSC-Gateway-Relay started (%s:%s)", server.address().address, server.address().port);
});



// --------- relay connection handling -------
io.on("connection", function(socket){
  // send online DSCs to new connected client
  socket.emit("onlineLines", onlineLines);

  // send the online lines to the line
  socket.on("getLines", function(){
    socket.emit("onlineLines", onlineLines);
  });
});



// Exit when the main process dies
process.once("disconnect", function(){
  console.error("[Webserver Worker] Master got disconnect event, trying to exit with 0");
  process.exit(0);
});

process.once("exit", function(code){
  console.error("[Webserver Worker] exit with %s", code);
});



var onlineLines = {lines: {}, teams: {}, staticContent: {}};

process.on("message", function(event){
  console.log(event);
  switch (event.type) {
  case "onlineLines":
    onlineLines = event.data;
    io.emit("onlineLines", onlineLines);
    break;
  case "disconnect":
    onlineLines = {lines: {}, teams: {}, staticContent: {}};
    io.emit("onlineLines", onlineLines);
    break;

  case "setConfig":
    if (onlineLines.lines[event.data.line] != null) {
      onlineLines.lines[event.data.line].cache.setConfig = event.data.data;
    }
    io.emit("setConfig", event.data);
    io.emit(event.data.line + "_setConfig", event.data.data);
    break;

  case "setData":
    if (onlineLines.lines[event.data.line] != null) {
      onlineLines.lines[event.data.line].cache.setData = event.data.data;
    }
    io.emit("setData", event.data);
    io.emit(event.data.line + "_setData", event.data.data);
    break;

  case "setTeam":
    onlineLines.teams[event.data.team.teamID] = event.data.data;
    io.emit("setTeam", event.data);
    io.emit(event.data.team.teamID + "_setTeam", event.data.data);
    break;

  default:
    console.error("Unnown event was called from main process", event);
  }
});
