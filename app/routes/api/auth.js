const validate = require('express-validation');

const { ApiAuthCtr } = require('../../controllers');
const { validUser } = require('../../services/security');
const { localAuthenticate } = require('../../services/auth/authentication');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/users/signup',
        method: 'POST',
        middlewares: [validate(validUser.signup)],
        controller: ApiAuthCtr.register,
        tags: 'api',
    },
    {
        prefix: `/api/${version}`,
        route: '/users/login',
        method: 'POST',
        middlewares: [validate(validUser.login), localAuthenticate()],
        controller: ApiAuthCtr.login,
        tags: 'api',
    },
];
