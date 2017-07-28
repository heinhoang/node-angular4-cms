const { API_VERSION } = require('../../constants');
const Role = require('./role');
const User = require('./user');

module.exports = [...User(API_VERSION), ...Role(API_VERSION)];
