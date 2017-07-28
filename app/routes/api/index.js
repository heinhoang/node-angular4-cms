const { API_VERSION } = require('../../constants');
const Role = require('./role');
const Auth = require('./auth');
const User = require('./user');

module.exports = [...Auth(API_VERSION), ...Role(API_VERSION), ...User(API_VERSION)];
