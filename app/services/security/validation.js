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

exports.vProductConfig = {
    payment: {
        body: Joi.object().keys({
            list: Joi.object().keys({
                items: Joi.array().items({
                    name: Joi.string().required(),
                    amount: Joi.number().min(1).required(),
                    price: Joi.number().greater(0).required(),
                    discount: Joi.number().greater(0).less(1),
                }),
            }),
        }),
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
