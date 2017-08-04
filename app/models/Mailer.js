const mongoose = require('mongoose');
const Joi = require('joi');

const { joiValidate } = require('../utils/security-helpers');

const emailProviders = ['normal', 'mailgun', 'postmark', 'mandrill', 'sendgrid', 'amazon'];
const Schema = mongoose.Schema;

const MailProviderSchema = new Schema({
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
});

module.exports = mongoose.model('MailProvider', MailProviderSchema);
