const { Mailer } = require('../../services');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/emails',
        method: 'POST',
        controller: Mailer.mailer,
        tags: 'api',
    },
];
