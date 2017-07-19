const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

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

/**
 * GET /login
 */
exports.loginGet = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    return res.render('account/login', {
        title: 'Log in',
    });
};

/**
 * POST /login
 */
exports.loginPost = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/login');
    }

    return passport.authenticate('local', (err, user, info) => {
        if (!user) {
            req.flash('error', info);
            return res.redirect('/login');
        }
        return req.logIn(user, (err) => {
            res.redirect('/');
        });
    })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

/**
 * GET /signup
 */
exports.signupGet = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    return res.render('account/signup', {
        title: 'Sign up',
    });
};

/**
 * POST /signup
 */
exports.signupPost = (req, res, next) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/signup');
    }

    return User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
            return res.redirect('/signup');
        }
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        return newUser.save((err) => {
            req.logIn(user, (err) => {
                res.redirect('/');
            });
        });
    });
};

/**
 * GET /account
 */
exports.accountGet = (req, res) => {
    res.render('account/profile', {
        title: 'My Account',
    });
};

/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = (req, res) => {
    if ('password' in req.body) {
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        req.assert('confirm', 'Passwords must match').equals(req.body.password);
    } else {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('email', 'Email cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({ remove_dots: false });
    }

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/account');
    }

    return User.findById(req.user.id, (err, success) => {
        const user = success;
        if ('password' in req.body) {
            user.password = req.body.password;
        } else {
            user.email = req.body.email;
            user.name = req.body.name;
            user.gender = req.body.gender;
            user.location = req.body.location;
            user.website = req.body.website;
        }
        user.save((error) => {
            if ('password' in req.body) {
                req.flash('success', { msg: 'Your password has been changed.' });
            } else if (error && error.code === 11000) {
                req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
            } else {
                req.flash('success', { msg: 'Your profile information has been updated.' });
            }
            res.redirect('/account');
        });
    });
};

/**
 * DELETE /account
 */
exports.accountDelete = (req, res) => {
    User.remove({ _id: req.user.id }, (err) => {
        req.logout();
        req.flash('info', { msg: 'Your account has been permanently deleted.' });
        res.redirect('/');
    });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = (req, res) => {
    User.findById(req.user.id, (err, success) => {
        const user = success;
        switch (req.params.provider) {
        case 'facebook':
            user.facebook = undefined;
            break;
        case 'google':
            user.google = undefined;
            break;
        case 'twitter':
            user.twitter = undefined;
            break;
        case 'vk':
            user.vk = undefined;
            break;
        case 'github':
            user.github = undefined;
            break;
        default:
            req.flash('error', { msg: 'Invalid OAuth Provider' });
            return res.redirect('/account');
        }
        return user.save((error) => {
            req.flash('success', { msg: 'Your account has been unlinked.' });
            res.redirect('/account');
        });
    });
};

/**
 * GET /forgot
 */
exports.forgotGet = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('account/forgot', {
        title: 'Forgot Password',
    });
};

/**
 * POST /forgot
 */
exports.forgotPost = (req, res) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/forgot');
    }

    return async.waterfall([
        (done) => {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({ email: req.body.email }, (err, success) => {
                const user = success;
                if (!user) {
                    req.flash('error', { msg: `The email address ${req.body.email} is not associated with any account.` });
                    return res.redirect('/forgot');
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            const transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD,
                },
            });
            const mailOptions = {
                to: user.email,
                from: 'support@yourdomain.com',
                subject: '✔ Reset your password on Mega Boilerplate',
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${req.headers.host}/reset/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('info', { msg: `An email has been sent to ${user.email} with further instructions.` });
                res.redirect('/forgot');
            });
        },
    ]);
};

/**
 * GET /reset
 */
exports.resetGet = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
            if (!user) {
                req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
                return res.redirect('/forgot');
            }
            return res.render('account/reset', {
                title: 'Password Reset',
            });
        });
};

/**
 * POST /reset
 */
exports.resetPost = (req, res) => {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('back');
    }

    return async.waterfall([
        (done) => {
            User.findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires').gt(Date.now())
                .exec((err, success) => {
                    const user = success;
                    if (!user) {
                        req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
                        return res.redirect('back');
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    return user.save((err) => {
                        req.logIn(user, (err) => {
                            done(err, user);
                        });
                    });
                });
        },
        (user, done) => {
            const transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD,
                },
            });
            const mailOptions = {
                from: 'support@yourdomain.com',
                to: user.email,
                subject: 'Your Mega Boilerplate password has been changed',
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash('success', { msg: 'Your password has been changed successfully.' });
                res.redirect('/account');
            });
        },
    ]);
};
