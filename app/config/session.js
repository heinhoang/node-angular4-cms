const session = require('express-session');

exports.init = () => session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
});
