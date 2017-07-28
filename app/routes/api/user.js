const { ApiUserCtr } = require('../../controllers');
const { jwtAuthenticate } = require('../../services/auth/authentication');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/users',
        method: 'GET',
        middlewares: [jwtAuthenticate],
        controller: ApiUserCtr.getList,
        tags: 'api',
    },
];
