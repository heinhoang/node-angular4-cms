const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

const { init: initSession } = require('./app/config/session');
const User = require('./app/models/User');
const ChatRoom = require('./app/models/ChatRoom');
const { createRoom, joinRoom, leaveRoom, newMessage } = require('./app/utils/socket-helpers');

class Socket {
    constructor(io) {
        this.io = io;
        this.config();
        this.events();
    }

    /**
     * Configure socket.io
     */
    config() {
        // Force Socket.io to ONLY use "websockets"; No Long Polling.
        this.io.set('transports', ['websocket']);
        // Using Redis
        const port = process.env.REDIS_PORT;
        const host = process.env.REDIS_HOST;
        const password = process.env.REDIS_PASSWORD;
        const pubClient = redis(port, host, { auth_pass: password });
        const subClient = redis(port, host, { auth_pass: password, return_buffers: true });
        this.io.adapter(adapter({ pubClient, subClient }));
        // Allow sockets to access session data
        // more: https://stackoverflow.com/questions/23494016/socket-io-and-express-4-sessions
        this.io.use((socket, next) => {
            initSession(socket.request, {}, next);
        });
    }

    /**
     * Define events
     */
    events() {
        this.io.of('/rooms').on('connection', (socket) => {
            this.createRoom(socket);
        });
        this.io.of('/chatroom').on('connection', (socket) => {
            createRoom(socket, ChatRoom);
            joinRoom(socket, ChatRoom, User);
            leaveRoom(socket, ChatRoom);
            newMessage(socket);
        });
    }
}

module.exports = io => new Socket(io);
