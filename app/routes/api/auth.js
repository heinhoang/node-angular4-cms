const validate = require('express-validation');

const { ApiAuthCtr } = require('../../controllers');
const { validUser } = require('../../services/security/validation');
const { localAuthenticate } = require('../../services/auth/authentication');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/register',
        method: 'POST',
        middlewares: [validate(validUser.signup)],
        controller: ApiAuthCtr.register,
        tags: 'api',
    },
    {
        prefix: `/api/${version}`,
        route: '/login',
        method: 'POST',
        middlewares: [validate(validUser.login), localAuthenticate()],
        controller: ApiAuthCtr.login,
        tags: 'api',
    },
    {
        prefix: `/api/${version}`,
        route: '/csrf',
        method: 'GET',
        controller: (req, res) => res.json({ csrfToken: req.csrfToken() }),
        tags: 'api',
    },
];
