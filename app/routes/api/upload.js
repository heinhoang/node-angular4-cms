const { uploader } = require('../../services');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/upload',
        method: 'POST',
        controller: uploader('array', ['avatar', 2], true),
        tags: 'api',
    },
];
