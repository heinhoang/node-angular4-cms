const Joi = require('joi');

// user api
exports.validUser = {
    signup: {
        body: {
            email: Joi.string().email().required()
                .regex(/^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i),
            password: Joi.string()
                .min(8)
                .required(),
            name: Joi.string().min(3).max(200),
        },
    },
    login: {
        body: {
            email: Joi.string().email().required()
                .regex(/^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i),
            password: Joi.string()
                .min(8)
                .required(),
        },
    },
};
