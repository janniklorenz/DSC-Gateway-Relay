"use strict";
//
// index.js
//
// Main file for DSC Gateway (Relay)
// The relay recives its data from a DSC Gateway, and send via SocketServer.js
// to each client.
//

const child_process = require("child_process");

const SocketIOClient = require("socket.io-client");

const config = require("./config/");



// Start Main Server Processes
var socketServerProcess = child_process.fork("./lib/SocketServer.js");

socketServerProcess.on("exit", function(){
  console.error("[Main Process] Socket Server Worker did exit, stopping DSC...");
  process.exit();
});



// -------- Client Socket --------
var clientSocket = SocketIOClient(config.relay.dscGatewayServer);

clientSocket.on('connect', function(){
  console.info("DSC-Gateway client socket connected");
});
clientSocket.on('disconnect', function(){
  console.info("DSC-Gateway client socket disconnected");
  socketServerProcess.send({
    type: "disconnect",
  });
});

clientSocket.on("onlineLines", function(data){
  socketServerProcess.send({
    type: "onlineLines",
    data: data,
  });
});
clientSocket.on("setConfig", function(data){
  socketServerProcess.send({
    type: "setConfig",
    data: data,
  });
});
clientSocket.on("setData", function(data){
  socketServerProcess.send({
    type: "setData",
    data: data,
  });
});
clientSocket.on("setTeam", function(data){
  socketServerProcess.send({
    type: "setTeam",
    data: data,
  });
});
