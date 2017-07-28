const RoleCtr = require('../../controllers/api/role');

module.exports = version => [
    {
        prefix: `/api/${version}`,
        route: '/roles',
        method: 'GET',
        controller: RoleCtr.getRoles,
        tags: 'api',
    },
    {
        prefix: `/api/${version}`,
        route: '/roles',
        method: 'POST',
        controller: RoleCtr.postRole,
        tags: 'api',
    },
    // {
    //     prefix: `/api/${version}`,
    //     route: '/roles:id',
    //     method: 'PUT',
    //     controller: RoleCtr.updateRole,
    //     tags: 'api',
    // },
    // {
    //     prefix: `/api/${version}`,
    //     route: '/roles:id',
    //     method: 'DELETE',
    //     controller: RoleCtr.deleteRole,
    //     tags: 'api',
    // },
];
