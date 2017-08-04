const sanitizeHtml = require('sanitize-html');

/**
 * Helper to sanitize body data (form fields)
 * @param {object} inputs such as req.body, req.query
 * @param {function} next next function of router
 */
const sanitizeInputs = (inputs) => {
    const data = {};
    for (let i = 0, keys = Object.keys(inputs); i < keys.length; i += 1) {
        data[keys[i]] = sanitizeHtml(inputs[keys[i]]);
    }
    return data;
};

/**
 * Sanitize query
 */
exports.sanitizeQuery = (req, res, next) => {
    try {
        req.query = sanitizeInputs(req.query);
        next();
    } catch (err) {
        next(err);
    }
};
