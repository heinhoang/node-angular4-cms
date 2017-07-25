const { Router } = require('express');

const { seedAll, clearAll } = require('./controllers');

const routes = new Router();

routes.get('/seed', seedAll);
routes.get('/clear', clearAll);

module.exports = routes;
