const User = require('../../models/User');
const HTTPStatus = require('http-status');

const { sanitizeUserInput } = require('../../utils/security-helpers');

/**
 * @api {post} api/{version}/users/signup Create a user
 * @apiDescription Create a user
 * @apiName createUser
 * @apiGroup User
 *
 * @apiParam (Body) {String} email User email.
 * @apiParam (Body) {String} password User password.
 * @apiParam (Body) {String} username User username.
 *
 * @apiSuccess {Number} status Status of the Request.
 * @apiSuccess {String} _id User _id.
 * @apiSuccess {String} token Authentication token.
 *
 * @apiSuccessExample Success-Response:
 *
 * HTTP/1.1 200 OK
 *
 * {
 *  _id: '123',
 *  token: 'JWT a_sample_token_string',
 * }
 *
 * @apiErrorExample {json} Error
 *  HTTP/1.1 400 Bad Request
 *
 *  {
 *    email: 'email is required'
 *  }
 */
exports.createUser = (req, res, next) => {
    const body = sanitizeUserInput(req, next);
    User.createAsync(body)
        .then(user => res.status(HTTPStatus.CREATED).json(user))
        .catch((e) => {
            const errMsg = {
                status: HTTPStatus.BAD_REQUEST,
                error: e,
            };
            return next(errMsg);
        });
};
