const HTTPStatus = require('http-status');
const util = require('util');

const User = require('../../models/User');
const { facet } = require('./facet');
const { getById, getWithPager } = require('../../utils/database/database-helpers');


/**
 * @api {get} /posts Get posts
 * @apiDescription Get a list of posts
 * @apiName getListOfPost
 * @apiGroup Post
 *
 * @apiHeader {Authorization} Authorization JWT Token
 *
 * @apiParam (query) {Int} skip Number of skip users
 * @apiParam (query) {Int} limit Maximum number of users
 *
 * @apiSuccess {Number} status Status of the Request.
 * @apiSuccess {Object[]} user User list.
 * @apiSuccess {String} user._id User _id.
 * @apiSuccess {String} user.name User name.
 * @apiSuccess {String} user.email User email.
 *
 *
 * @apiParam (Login) {String} pass Only logged in users can do this.
 * 
 * @apiRequestUrlExample http://localhost:4000/api/v1/users?found[name]=ad&limited=2&fields=-_id%20email&sorted=-addedOn%20name
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "AUTHORIZATION": "JWT sample_token_string
 * }
 *
 * @apiSuccessExample Success-Response:
 *
 * HTTP/1.1 200 OK
 *
 * [
 *  {
 *    _id: '123',
 *    name: 'john',
 *    email: 'aaa@bb.com',
 *    ...
 *  },
 *  {
 *    _id: '123',
 *    name: 'john',
 *    email: 'aaa@bb.com',
 *    ...
 *  },
 * ]
 *
 * @apiErrorExample {json} User not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
exports.getList = (req, res) => {
    // Prepare to get result
    const {
        find: findOpts = {},
        select: selectOpts = null,
        sort: sortOpts = { addedOn: -1 },
        pager: pagerOpts = {
            perPage: 0,
            page: 1,
        },
    } = req.query;
    findOpts.deleted = findOpts.deleted || false;
    if (findOpts.name) findOpts.name = new RegExp(findOpts.name, 'i');
    pagerOpts.perPage = parseInt(pagerOpts.perPage, 10);
    pagerOpts.page = parseInt(pagerOpts.page, 10);

    return facet(getWithPager,
        [User, { findOpts, selectOpts, sortOpts, pagerOpts }],
        { req, res });
};

/**
 * Get user by Id
 */
exports.getById = (req, res) => {
    const { userId: modelId } = req.params;
    const { select: selectOpts } = req.query;
    return facet(getById, [User, { modelId, selectOpts }], { req, res });
};

