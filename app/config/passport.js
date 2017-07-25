const { waterfall } = require('async');
const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
// const VKontakteStrategy = require('passport-vkontakte').Strategy;
// const GithubStrategy = require('passport-github').Strategy;

const User = require('../models/User');

const Passport = {};

/**
 * settings for session
 */
const sessionSetting = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

/**
 * Settings for localStrategy (Sign in with Email and Password)
 */

const localStrategy = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // prevent callback hell, more here: http://blog.vullum.io/javascript-flow-callback-hell-vs-async-vs-highland/
    waterfall([
        // find user
        (next) => {
            User.findOne({ email }, (err, user) => {
                if (err) {
                    next(err, null);
                }
                next(null, user);
            });
        },
        // check password
        (user, next) => {
            let result;
            if (!user) {
                result = done(null, false, {
                    msg: `The email address ${email} is not associated with any account. Double-check your email address and try again.`,
                });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    next(err, null);
                }
                if (!isMatch) {
                    result = done(null, false, { msg: 'Invalid email or password' });
                }
                result = done(null, user);
            });
            next(null, result);
        },
    ],
        (err, result) => {
            if (err) {
                return done(err, false);
            }
            return result;
        });
});

/**
 * Setting authentication using jwt
 */
const jwtOpts = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader('authorization'),
    // Telling Passport where to find the secret
    secretOrKey: process.env.JWT_SECRET,
};

const jwtLogin = new JWTStrategy(jwtOpts, (payload, done) => {
    User.findOne({ id: payload.sub }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
});

Passport.init = () => {
    sessionSetting();
    passport.use(localStrategy);
    passport.use(jwtLogin);
};

module.exports = Passport;
