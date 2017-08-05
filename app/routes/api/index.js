const { API_VERSION } = require('../../constants');
const Role = require('./role');
const Auth = require('./auth');
const User = require('./user');
const Mailer = require('./mailer');
const Upload = require('./upload');

module.exports = [
    ...Auth(API_VERSION),
    ...Role(API_VERSION),
    ...User(API_VERSION),
    ...Mailer(API_VERSION),
    ...Upload(API_VERSION),
];
