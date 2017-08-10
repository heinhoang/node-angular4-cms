const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    connections: {
        type: [{ userId: String, socketId: String }],
    },
    addedBy: {
        type: String,
        trim: true,
    },
    addedOn: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: String,
        trim: true,
    },
    updatedOn: {
        type: Date,
    },
    deletedBy: {
        type: String,
        trim: true,
    },
    deletedOn: {
        type: Date,
    },
});

let ChatRoom;
try {
    ChatRoom = mongoose.model('ChatRoom');
} catch (e) {
    ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
}

module.exports = ChatRoom;
