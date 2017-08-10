const { facet } = require('./facet');
const ChatRoom = require('../../models/ChatRoom');
const { getById, getList } = require('../../utils/database/database-helpers');

/**
 * get room list
 */
exports.getRooms = (req, res) => facet(getList, [ChatRoom, {}], { req, res });

/**
 * get room by id
 */
exports.getRoomById = (req, res) => {
    const modelId = req.params.id;
    return facet(getById, [ChatRoom, { modelId }], { req, res });
};
