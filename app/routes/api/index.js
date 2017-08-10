const { API_VERSION } = require('../../constants');
const Role = require('./role');
const Auth = require('./auth');
const User = require('./user');
const Mailer = require('./mailer');
const Upload = require('./upload');
const Payment = require('./payment');
const Chat = require('./chat');

module.exports = [
    ...Auth(API_VERSION),
    ...Role(API_VERSION),
    ...User(API_VERSION),
    ...Mailer(API_VERSION),
    ...Upload(API_VERSION),
    ...Payment(API_VERSION),
    ...Chat(API_VERSION),
];
