const passport = require('passport');

/**
 * Local Authentication Middleware
 */
exports.localAuthenticate = () => passport.authenticate('local', { session: false });

/**
 * Jwt Authentication Middleware
 */
exports.jwtAuthenticate = () => passport.authenticate('jwt', { session: false });

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
