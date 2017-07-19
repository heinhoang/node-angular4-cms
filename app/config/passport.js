const passport = require('passport');
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
    User.findOne({ email }, (err, user) => {
        if (!user) {
            return done(null, false, {
                msg: `The email address ${email} is not associated with any account. Double-check your email address and try again.`,
            });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
                return done(null, false, { msg: 'Invalid email or password' });
            }
            return done(null, user);
        });
    });
});

Passport.init = () => {
    sessionSetting();
    passport.use(localStrategy);
};

module.exports = Passport;
