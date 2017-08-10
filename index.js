const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const { initApp, initServer, endServer } = require('./server');
const Socket = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

// config app
initApp(app, port);

// make sure we don't run a second instance
if (!module.parent) {
    // Start server
    initServer(server, port);
    // Start io server
    Socket(io);
    // End server
    endServer(server);
}

module.exports = app;
