const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const Joi = require('joi');

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

/**
 * hash password based on bcrypt
 * @public
 * @param {String} password password to hash
 * @param {function} done callback
 */
exports.cryptPassword = (password, done) => bcrypt.genSalt(10, (error, salt) => {
    if (error) {
        done(error, null);
    } else {
        bcrypt.hash(password, salt, null, (err, hash) => done(err, hash));
    }
});

/**
 * Validate based on Joi
 * @param {object} validated validated object
 * @param {object} schema schema to validate validated object
 * @returns boolean
 */
exports.joiValidate = (validated, schema) => {
    const joiSchema = Joi.object().keys(schema);
    return Joi.validate(validated, joiSchema);
};
