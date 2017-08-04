const passport = require('passport');

/**
 * Local Authentication Middleware
 */
exports.localAuthenticate = () => passport.authenticate('local', { session: false });

/**
 * Jwt Authentication Middleware
 */
exports.jwtAuthenticate = () => passport.authenticate('jwt', { session: false });
// (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) return next(err); // It is null
//     if (!user) return res.status(403).json(info);
//     return res.status(200).json(user);
// });

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
