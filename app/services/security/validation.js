const Joi = require('joi');

const vConfig = {
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .required(),
    name: Joi.string().min(3).max(200)
        .regex(/^[a-zA-Z0-9\s']+$/i),
};

// user validation schema
exports.validUser = {
    signup: {
        body: vConfig,
    },
    login: {
        body: {
            email: vConfig.email,
            password: vConfig.password,
        },
    },
    list: {
        query: {
            name: vConfig.name,
        },
    },
};

// uri validation
exports.validURI = (req, res, next) => {
    const valid = /[\w\-+~:/?#[\]@&'=]+$/i.test(req.originalUrl);
    console.log(req.originalUrl);
    const err = {
        error: 'Your original url is not valid',
    };
    return valid ? next() : next(err);
};
