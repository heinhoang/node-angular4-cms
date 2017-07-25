const passport = require('passport');

/**
 * Local Authentication Middleware
 */
exports.localAuthenticate = () => {
    passport.authenticate('local');
};

/**
 * Jwt Authentication Middleware
 */
exports.jwtAuthenticate = () => {
    passport.authenticate('jwt');
};

/**
 * Login required middleware
 */
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};
