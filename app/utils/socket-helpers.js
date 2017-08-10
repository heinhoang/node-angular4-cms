const DbHelpers = require('./database/database-helpers');
const DbSocketHelpers = require('./database/db-socket-helpers');
/**
 * Create a new room
 */
exports.createRoom = (socket, ChatRoom) => {
    socket.on('createRoom', (roomName) => {
        ChatRoom.findOneOrCreate({ name: new RegExp(`^${roomName}$`) })
            .then((newRoom) => {
                socket.emit('updateRoomsList', newRoom);
                socket.broadcast.emit('updateRoomsList', newRoom);
            })
            .catch(e => socket.emit('updateRoomsList', { error: e }));
    });
};

/**
 * Join Chat Room
 */
exports.joinRoom = (socket, ChatRoom, User) => {
    // get room
    socket.on('join', (roomId) => {
        const passportSession = socket.request.session.passport;
        let newRoom;
        DbHelpers.getById(ChatRoom, { modelId: roomId })
            .then((room) => {
                if (passportSession === null) {
                    return;
                }
                if (!room) {
                    socket.emit('updateUsersList', { error: 'Room doesn\'t exist' });
                }
                // add user to room
                DbSocketHelpers.addUsers();
            })
            .then((joinedRoom) => {
                newRoom = joinedRoom;
                socket.join(joinedRoom.id);
                // get users in room
                DbSocketHelpers.getUsers(joinedRoom, User, passportSession.user);
            })
            .then((data) => {
                socket.emit('updateUsersList', data.users, true);
                // Return the current user to other connecting sockets in the room
                if (data.connNum === 1) {
                    socket.broadcast.to(newRoom.id).emit('updateUsersList', data.users[data.users.length - 1]);
                }
            });
    });
};

/**
 * Leave chat room
 */
exports.leaveRoom = (socket, ChatRoom) => {
    socket.on('connected', () => {
        const passportSession = socket.request.session.passport;
        if (passportSession == null) {
            return null;
        }
        return DbSocketHelpers.removeUser(ChatRoom, socket.id, passportSession.user)
            .then((data) => {
                socket.leave(data.room.id);
                if (data.connNum === 1) {
                    socket.broadcast.to(data.room.id).emit('removeUser', data.userId);
                }
            })
            .catch(e => new Error(e));
    });
};

/**
 * New message
 */
exports.newMessage = (socket) => {
    socket.on('newMessage', (roomId, message) => {
        socket.broadcast.to(roomId).emit('addMessage', message);
    });
};
