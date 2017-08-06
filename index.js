"use strict";
//
// index.js
//
// Main file for DSC Gateway (Relay)
// The relay recives its data from a DSC Gateway, and send via SocketServer.js
// to each client.
//

const http = require("http");
const child_process = require("child_process");

const SocketIOClient = require("socket.io-client");
const SocketIO = require("socket.io");

const config = require("./config/");


// -------- Server Socket --------
var server = http.Server();
server.listen(config.network.controller.port, config.network.controller.address);
server.on("listening", function() {
  console.info("DSC-Gateway-Relay Controller started (%s:%s)", server.address().address, server.address().port);
});


// --------- relay connection handling -------
var io = SocketIO(server);
io.on("connection", function(socket){
  console.info("DSC-Gateway controller client connected");

  socket.on('disconnect', function(){
    console.info("DSC-Gateway controller client disconnected");
    socketServerProcess.send({
      type: "disconnect",
    });
  });

  socket.on("onlineLines", function(data){
    socketServerProcess.send({
      type: "onlineLines",
      data: data,
    });
  });
  socket.on("setConfig", function(data){
    socketServerProcess.send({
      type: "setConfig",
      data: data,
    });
  });
  socket.on("setData", function(data){
    socketServerProcess.send({
      type: "setData",
      data: data,
    });
  });
  socket.on("setTeam", function(data){
    socketServerProcess.send({
      type: "setTeam",
      data: data,
    });
  });

});


// Start Main Server Processes
var socketServerProcess = child_process.fork("./lib/GatewayHandler/Server/");
socketServerProcess.send({
  type: "connect",
  data: config.network.relay,
});
socketServerProcess.on("exit", function(){
  console.error("[Main Process] Socket Server Worker did exit, stopping DSC...");
  process.exit();
});
