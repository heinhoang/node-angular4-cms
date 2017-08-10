const ChatCtr = require('../../controllers/api/chat');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/chat/rooms',
        method: 'GET',
        controller: ChatCtr.getRooms,
        tags: 'api',
    },
    {
        prefix: `/api/${version}`,
        route: '/chat/rooms/:id',
        method: 'GET',
        controller: ChatCtr.getRoomById,
        tags: 'api',
    },
];
