const http = require('http');
const express = require('express');

const { initApp, initServer, endServer } = require('./server');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// config app
initApp(app, port);

// make sure we don't run a second instance
if (!module.parent) {
    // Start server
    initServer(server, port);
    // End server
    endServer(server);
}

module.exports = app;
