const HTTPStatus = require('http-status');

const User = require('../../models/User');
const Role = require('../../models/Role');
const { getById, getOne } = require('../../utils/database/database-helpers.js');

exports.authorize = (req, res, next) => {
    let error = {
        status: HTTPStatus.UNAUTHORIZED,
        message: 'You don\'t have right to access this page',
    };
    error = JSON.stringify(error, { depth: null });
    const { _id: userId } = req.user ? req.user : { _id: 'guest' };

    // get user
    getById(User, { modelId: userId, selectOpts: 'userRole' })
        .then(((user) => {
            const userRole = user ? user.userRole : 'guest';
            return getOne(Role, { query: { roleName: userRole } });
        }))
        .then((role) => {
            switch (req.method) {
            case 'GET':
                if (role.read) { next(); } else { next(error); }
                break;
            case 'POST':
                if (role.write && role.create) { next(); } else { next(error); }
                break;
            case 'PUT':
            case 'PATCH':
                if (role.write && role.change) { next(); } else { next(error); }
                break;
            case 'DELETE':
                if (role.delete) { next(); } else { next(error); }
                break;
            default:
                next(error);
            }
            console.log(role.read, role.write, role.create, role.change, role.delete);
        })
        .catch(e => next(e));
};
