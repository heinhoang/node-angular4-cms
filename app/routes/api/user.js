const validate = require('express-validation');

const { ApiUserCtr } = require('../../controllers');
const { jwtAuthenticate } = require('../../services/auth/authentication');
const { validUser, validURI } = require('../../services/security/validation');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/users',
        method: 'GET',
        middlewares: [
            jwtAuthenticate(),
            validURI,
            validate(validUser.list),
        ],
        controller: ApiUserCtr.getList,
        tags: 'api',
    },
    {
        prefix: `/api/${version}`,
        route: '/users/:userId',
        method: 'GET',
        middlewares: [
            jwtAuthenticate(),
            validURI,
        ],
        controller: ApiUserCtr.getById,
        tags: 'api',
    },
];
