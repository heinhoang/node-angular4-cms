const validate = require('express-validation');

const { mailer } = require('../../services/mailer');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/emails',
        method: 'POST',
        controller: mailer,
        tags: 'api',
    },
];
