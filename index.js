const http = require('http');
const express = require('express');

const AppServer = require('./server');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

if (!module.parent) {
    // Start server
    AppServer.init(server, app, port);
    AppServer.end(server);
}
