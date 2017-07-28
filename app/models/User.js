const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { createToken } = require('../utils/security-helpers.js');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        trim: true,
        validate: {
            validator(email) {
                // https://www.sitepoint.com/javascript-validate-email-address-regex/
                const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
                return emailRegex.test(email);
            },
            message: '{VALUE} is not a valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        trim: true,
        minlength: [8, 'password need to be longer'],
        validate: {
            validator(pwd) {
                return pwd.length >= 8;
            },
        },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    userRole: {
        type: String,
        trim: true,
        default: 'guest',
    },
    active: {
        type: Boolean,
        default: true,
    },
    addedOn: {
        type: Date,
        default: Date.now,
    },
    gender: String,
    location: String,
    website: String,
    picture: String,
    facebook: String,
    twitter: String,
    google: String,
    github: String,
}, {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    });

// Add schema plugin
UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} was already taken',
});

// Before save
UserSchema.pre('save', function hashPassword(next) {
    const user = this;
    if (user.isModified('password')) {
        return bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            return bcrypt.hash(user.password, salt, null, (err2, hash) => {
                if (err2) return next(err2);
                user.password = hash;
                return next();
            });
        });
    }
    return next();
});

// Schema methods
UserSchema.methods = {
    /**
     * compare password before saving
     * @param {password} password to compare
     * @param {cb} callback(err, isMatch)
     */
    comparePassword(password, cb) {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            cb(err, isMatch);
        });
    },
};

// Schema virtual properties
UserSchema.virtual('gravatar').get(function getGravatar() {
    if (!this.get('email')) {
        return 'https://gravatar.com/avatar/?s=200&d=retro';
    }
    const md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
});

// Schema Options
UserSchema.options.toJSON = {
    transform(doc, _ret) {
        const ret = _ret;
        const { _id } = ret;
        ret.token = `JWT ${createToken(_id)}`;
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
    },
};

// for this issue: https://stackoverflow.com/a/38143030/3765825
let User;
try {
    User = mongoose.model('User');
} catch (e) {
    User = mongoose.model('User', UserSchema);
}

module.exports = User;
