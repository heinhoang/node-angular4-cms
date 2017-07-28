const validate = require('express-validation');

const { ApiUserCtr } = require('../../controllers');
const { validUser } = require('../../services/security');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/users/signup',
        method: 'POST',
        controller: ApiUserCtr.createUser,
        middlewares: [validate(validUser.create)],
        tags: 'api',
    },
];
