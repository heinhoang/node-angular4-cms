const RoleCtr = require('../controllers/api/role');

const apiVersion = 'v1';
module.exports = [
    {
        prefix: `/api/${apiVersion}`,
        route: '/roles',
        method: 'GET',
        controller: RoleCtr.getRoles,
        tags: 'api',
    },
    {
        prefix: `/api/${apiVersion}`,
        route: '/roles',
        method: 'POST',
        controller: RoleCtr.postRole,
        tags: 'api',
    },
    // {
    //     prefix: `/api/${apiVersion}`,
    //     route: '/roles:id',
    //     method: 'PUT',
    //     controller: RoleCtr.updateRole,
    //     tags: 'api',
    // },
    // {
    //     prefix: `/api/${apiVersion}`,
    //     route: '/roles:id',
    //     method: 'DELETE',
    //     controller: RoleCtr.deleteRole,
    //     tags: 'api',
    // },
];
