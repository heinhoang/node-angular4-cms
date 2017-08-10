const Promise = require('bluebird');

/**
 * Add user to a chat room
 * @param {Document} Room Char room model
 * @param {String} socketId socket id
 * @param {String} userId user id
 */
exports.addUsers = (Room, socketId, userId) => {
    const conn = { userId, socketId };
    Room.connections.push(conn);
    Room.createAsync();
};

/**
 * Get all users connected to a room
 * @param {Document} Room Char room model
 * @param {Model} User user model
 * @param {userId} userId user id
 * @returns {Promise} users of rooms and rooms count in which current user joined
 */
exports.getUsers = (Room, User, userId) => {
    let connNum = 0;
    const users = [];
    Room.connections.forEach((conn) => {
        connNum = conn.userId === userId ? connNum + 1 : connNum;
        // get all user Ids
        if (!users.includes(conn.userId)) {
            users.push(conn.userId);
        }
    });
    // get all users insteads of user ids
    return new Promise((resolve, reject) => {
        users.forEach((uId, i) => {
            User.findByIdAsync(uId)
                .then((user) => {
                    users[i] = user;
                    if (i + 1 === users.length) {
                        resolve({ users, connNum });
                    }
                })
                .catch(e => reject(e));
        });
    });
};
/**
 * Remove user from room
 */
exports.removeUser = (RoomModel, socketId, userId) => new Promise((resolve, reject) => {
    RoomModel.findAsync()
        .then((rooms) => {
            rooms.every((room) => {
                let removed = false;
                let target = 0;
                let connNum = 0;
                room.connections.forEach((conn, i) => {
                    if (conn.userId === userId) {
                        connNum += 1;
                    }
                    if (conn.socketId === socketId) {
                        removed = true;
                        target = i;
                    }
                });
                if (removed) {
                    room.connections.splice(target, 1);
                    return room.saveAsync()
                        .then(() => ({ room, userId, connNum }));
                }
                return new Error('can\'t delete');
            });
        })
        .then(data => resolve(data))
        .catch(e => reject({ error: e }));
});
