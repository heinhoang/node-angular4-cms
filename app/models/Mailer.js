const mongoose = require('mongoose');
const Joi = require('joi');

const { joiValidate } = require('../utils/security-helpers');

const emailProviders = ['normal', 'mailgun', 'postmark', 'mandrill', 'sendgrid', 'amazon'];
const Schema = mongoose.Schema;

const MailerSchema = new Schema({
    providerType: {
        type: String,
        required: true,
        trim: true,
        enum: emailProviders,
    },
    default: {
        type: Boolean,
        default: false,
    },
    host: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator(hostName) {
                return hostName ?
                    joiValidate({ hostName }, { hostName: Joi.string().hostname() }) : true;
            },
            message: '{VALUE} is not a valid host name!',
        },
    },
    port: {
        type: Number,
        trim: true,
        validate: {
            validator(portNumber) {
                return portNumber ?
                    joiValidate({ portNumber }, { portNumber: Joi.number().max(10000) }) : true;
            },
            message: '{VALUE} is not a valid SMTP port number!',
        },
    },
    secure: {
        type: Boolean,
        default: true,
    },
    authUserName: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
    },
    authPassword: {
        type: String,
        trim: true,
    },
    pool: {
        type: Boolean,
        default: false,
    },
    apiKey: {
        type: String,
        trim: true,

    },
    apiSecret: {
        type: String,
        trim: true,
    },
    apiUser: {
        type: String,
        trim: true,
    },
    domain: {
        type: String,
        trim: true,
    },
    rateLimit: {
        type: Number,
        trim: true,
        default: 1,
        validate: {
            validator(rateLimit) {
                return rateLimit ? joiValidate({ rateLimit }, { rateLimit: Joi.number() }) : true;
            },
            message: '{VALUE} is not a valid rate limit!',
        },
    },
    addedBy: {
        type: String,
        trim: true,
    },
    addedOn: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: String,
        trim: true,
    },
    updatedOn: {
        type: Date,
    },
    deletedBy: {
        type: String,
        trim: true,
    },
    deletedOn: {
        type: Date,
    },
});

// Only one default field set to true
MailerSchema.pre('save', function defaultField(next) {
    if (this.default === true) {
        this.constructor.update({}, { $set: { default: false } }, { multi: true }).exec();
    }
    next();
});

let Mailer;
try {
    Mailer = mongoose.model('Mailer');
} catch (e) {
    Mailer = mongoose.model('Mailer', MailerSchema);
}

module.exports = Mailer;
