const Views = require('./views');
const Api = require('./api');

module.exports = Services => [...Views(Services), ...Api];
