const validate = require('express-validation');

const { Payment } = require('../../services');
const { vProductConfig } = require('../../services/security/validation');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/payment',
        method: 'POST',
        middlewares: [validate(vProductConfig.payment)],
        controller: Payment.pay,
        tags: 'api',
    },
];
