const util = require('util');
const HTTPStatus = require('http-status');

const RoleModel = require('../../models/Role');
const { crudCreate, crudGetAll } = require('../../utils/database/database-helpers');
const { sanitizeUserInput, validateNormalString } = require('../../utils/security-helpers');

/**
 * Create new role
 */
exports.postRole = (req, res, next) => {
    if (req.user) {
        // Validation Check
        validateNormalString(['roleName'], req);

        req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                res.status(HTTPStatus.BAD_REQUEST).send(`There have been validation errors: ${util.inspect(result.array())}`);
                return null;
            }

            // Sanitize
            const formData = sanitizeUserInput(req, next);

            const { _id: userId } = req.user;
            let roleInfo = {
                addedBy: userId,
                addedOn: new Date(),
            };
            roleInfo = Object.assign(new RoleModel(), roleInfo, formData);
            const successMsg = { message: 'You have posted a role successfully' };

            return crudCreate(roleInfo, successMsg)
                .then(resolve => res.status(HTTPStatus.CREATED).json(JSON.stringify(resolve)))
                .catch(reject => res.status(HTTPStatus.INTERNAL_SERVER_ERROR)
                    .json(JSON.stringify({ reject })));
        });
    }

    return res.status(HTTPStatus.FORBIDDEN).json(JSON.stringify({ message: 'You need to login first' }));
};

/**
 * Get all roles
 */
exports.getRoles = (req, res) => {
    // validate
    req.checkQuery('getparam', 'Invalid getparam').isInt();
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send('There have been validation errors');
    }

    // Prepare to get result
    const queries = {};
    if (req.query.rolename) {
        queries.roleName = { $regex: new RegExp(`.*${req.query.rolename}`, 'i') };
    }
    queries.deleted = false;
    const fields = '';
    const sortedFields = { addedOn: -1 };

    // get result
    return crudGetAll(RoleModel, queries, fields, sortedFields)
        .then(resolve => res.status(HTTPStatus.OK).json(JSON.stringify(resolve)))
        .catch(reject => res.json(JSON.stringify({ error: reject })));
    // req.getValidationResult()
    //     .then((result) => {
    //         if (!result.isEmpty()) {
    //             return res.status(400).send(`There have been validation errors: ${util.inspect(result.array())}`);
    //         }
    //         const queries = {};
    //         if (req.query.rolename) {
    //             queries.roleName = { $regex: new RegExp(`.*${req.query.rolename}`, 'i') };
    //         }
    //         queries.deleted = false;
    //         const fields = '';
    //         const sortedFields = { addedOn: -1 };

    //         return crudGetAll(RoleModel, queries, fields, sortedFields)
    //             .then(resolve => res.status(HTTPStatus.OK).json(JSON.stringify(resolve)))
    //             .catch(reject => res.json(JSON.stringify({ error: reject })));
    //     });
};
