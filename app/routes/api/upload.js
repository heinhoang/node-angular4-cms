const { Uploader } = require('../../services');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/upload',
        method: 'POST',
        controller: Uploader.upload('array', ['avatar', 2], true),
        tags: 'api',
    },
];
