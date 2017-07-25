const sanitizeHtml = require('sanitize-html');

/**
 * Helper to sanitize body data (form fields)
 */
exports.sanitizeUserInput = (req, next) => {
    try {
        const data = {};

        for (let i = 0, keys = Object.keys(req.body); i < keys.length; i += 1) {
            data[keys[i]] = sanitizeHtml(req.body[keys[i]]);
        }
        return data;
    } catch (err) {
        return next(err);
    }
};

/**
 * Helper to validate normal character
 */
exports.validateNormalString = (strings, req) => {
    const options = {};

    for (let i = 0; i < strings.length; i += 1) {
        options[strings[i]] = {
            notEmpty: true,
            matches: {
                options: /[a-zA-Z0-9]/i,
                errorMessage: `${strings[i]} must be not empty and does not have special characters`,
            },
        };
    }

    req.assert(options);
};
