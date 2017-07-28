const HTTPStatus = require('http-status');
const Joi = require('joi');

const User = require('../../models/User');
const { crudCreate, crudGetAll } = require('../../utils/database/database-helpers');

/**
 * @api {get} /posts Get posts
 * @apiDescription Get a list of posts
 * @apiName getListOfPost
 * @apiGroup Post
 *
 * @apiHeader {Authorization} Authorization JWT Token
 *
 * @apiParam (query) {Int} skip Number of skip posts
 * @apiParam (query) {Int} limit Maximum number of posts
 *
 * @apiSuccess {Number} status Status of the Request.
 * @apiSuccess {Object[]} post Post list.
 * @apiSuccess {String} post._id Post _id.
 * @apiSuccess {String} post.title Post title.
 * @apiSuccess {String} post.text Post text.
 * @apiSuccess {Object} post.author Post author.
 * @apiSuccess {String} post.author._id Post author _id.
 * @apiSuccess {String} post.author.username Post author username.
 * @apiSuccess {String} post.createdAt Post created date.
 *
 *
 * @apiParam (Login) {String} pass Only logged in users can do this.
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "AUTHORIZATION": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTBhMWI3ODAzMDI3N2NiNjQxM2JhZGUiLCJpYXQiOjE0OTM4MzQ2MTZ9.RSlMF6RRwAALZQRdfKrOZWnuHBk-mQNnRcCLJsc8zio"
 * }
 *
 * @apiSuccessExample Success-Response:
 *
 * HTTP/1.1 200 OK
 *
 * [
 *  {
 *    _id: '123',
 *    title: 'New title 1',
 *    text: 'New text 1',
 *    createdAt: '2017-05-03',
 *    author: {
 *      _id: '123312',
 *      username: 'Jon'
 *    }
 *  },
 *  {
 *    _id: '12234',
 *    title: 'New title 2',
 *    text: 'New text 2',
 *    createdAt: '2017-05-03',
 *    author: {
 *      _id: '123312234',
 *      username: 'Jon'
 *    }
 *  }
 * ]
 *
 * @apiErrorExample {json} Post not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
exports.getList = (req, res, next) => {
    // Validation
    const vSchema = Joi.object.keys({
        name: Joi.string().alphanum().required(),
    });
    const result = Joi.validate({ name: req.query.name }, vSchema);
    if (result.error) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
            message: 'validation error',
            error: result.error,
        });
    }

    // Prepare to get result
    const queries = {};
    if (req.query.rolename) {
        queries.name = { $regex: new RegExp(`.*${req.query.name}`, 'i') };
    }
    queries.deleted = false;
    const fields = '';
    const sortedFields = { addedOn: -1 };

    return crudGetAll(User, queries, fields, sortedFields)
        .then(resolve => res.status(HTTPStatus.OK).json(resolve))
        .catch(reject => next({ error: reject }));
};
