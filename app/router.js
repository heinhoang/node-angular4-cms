const Router = require('express').Router();

const Routes = require('./routes');
const { authorize } = require('./services/auth/authorization');

// register general middlewares
const generalMiddlewares = [authorize];

/**
 * Loop all routes and run HTTP method respectively
 * @return {Router} express router
 */
exports.init = () => {
    // general middlewares
    Router.use(...generalMiddlewares);

    for (let i = 0; i < Routes.length; i += 1) {
        const method = Routes[i].method.toLocaleLowerCase() || 'get';
        const { controller, prefix, sufix } = Routes[i];
        let route = Routes[i].route;
        route = prefix ? prefix + route : route;
        route = sufix ? route + sufix : route;
        const middlewares = Routes[i].middlewares ? Routes[i].middlewares : null;

        if (route && typeof controller === 'function') {
            if (middlewares !== null && Array.isArray(middlewares)) {
                Router[method](route, ...middlewares, controller);
            } else {
                Router[method](route, controller);
            }
        }
    }
    return Router;
};
