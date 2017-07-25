const Router = require('express').Router();

const routes = require('./routes');

/**
 * Loop all routes and run HTTP method respectively
 * @return {Router} express router
 */
exports.init = (Services) => {
    const Routes = routes(Services);

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