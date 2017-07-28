const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');

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
 * Validator helper to validate a string contains normal characters only
 */
exports.isNormalString = string => /[a-zA-Z0-9]/i.test(string);

/**
 * Generate a jwt token for authentication
 *
 * @public
 * @returns {String} token - JWT token
 */
exports.createToken = _id => jwt.sign({ _id }, process.env.JWT_SECRET);
