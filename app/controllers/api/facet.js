const HTTPStatus = require('http-status');

/**
 * Facet of API controllers
 * @param {function} func API controller
 * @param {Array} funcParams API controller params
 * @param {object} info default null API output object like this
 * {
 *      successStatus: HTTPStatus.OK,
 *      successJSON: resolve object,
 *      failureStatus: HTTPStatus.BAD_REQUEST,
 *      failureJSON: reject object
 * }
 */
exports.facet = (func, funcParams, routerParams, info = {}) => {
    if (typeof func === 'function') {
        func(...funcParams)
            .then((resolve) => {
                const {
                        successStatus = HTTPStatus.OK,
                        successJSON = resolve,
                    } = info;
                return routerParams.res
                    .status(successStatus).json(successJSON);
            })
            .catch((reject) => {
                const {
                        failureStatus = HTTPStatus.BAD_REQUEST,
                        failureJSON = reject,
                    } = info;
                return routerParams.res
                    .status(failureStatus).json({ error: failureJSON });
            });
    }
};
