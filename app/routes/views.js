const { HomeCtr, ContactCtr, UserCtr } = require('../controllers');
// const { Authentication, Authorization } = require('../services');

module.exports = (Services) => {
    const { Authentication, Authorization } = Services;
    return [
        {
            route: '/',
            method: 'GET',
            controller: HomeCtr.index,
            tags: 'views',
        },
        {
            route: '/contact',
            method: 'GET',
            controller: ContactCtr.contactGet,
            tags: 'views',
        },
        {
            route: '/contact',
            method: 'POST',
            controller: ContactCtr.contactPost,
            tags: 'views',
        },
        {
            route: '/account',
            method: 'GET',
            controller: UserCtr.accountGet,
            middlewares: [Authentication.ensureAuthenticated],
            tags: 'views',
        },
        {
            route: '/account',
            method: 'PUT',
            controller: UserCtr.accountPut,
            middlewares: [Authentication.ensureAuthenticated],
            tags: 'views',
        },
        {
            route: '/account',
            method: 'DELETE',
            controller: UserCtr.accountDelete,
            middlewares: [Authentication.ensureAuthenticated],
            tags: 'views',
        },
        {
            route: '/signup',
            method: 'GET',
            controller: UserCtr.signupGet,
            tags: 'views',
        },
        {
            route: '/signup',
            method: 'POST',
            controller: UserCtr.signupPost,
            tags: 'views',
        },
        {
            route: '/login',
            method: 'GET',
            controller: UserCtr.loginGet,
            tags: 'views',
        },
        {
            route: '/login',
            method: 'POST',
            controller: UserCtr.loginPost,
            tags: 'views',
        },
        {
            route: '/forgot',
            method: 'GET',
            controller: UserCtr.forgotGet,
            tags: 'views',
        },
        {
            route: '/forgot',
            method: 'POST',
            controller: UserCtr.forgotPost,
            tags: 'views',
        },
        {
            route: '/reset/:token',
            method: 'GET',
            controller: UserCtr.resetGet,
            tags: 'views',
        },
        {
            route: '/reset/:token',
            method: 'POST',
            controller: UserCtr.resetPost,
            tags: 'views',
        },
        {
            route: '/logout',
            method: 'GET',
            controller: UserCtr.logout,
            tags: 'views',
        },
        {
            route: '/unlink/:provider',
            method: 'GET',
            controller: UserCtr.unlink,
            middlewares: [Authentication.ensureAuthenticated],
            tags: 'views',
        },
    ];
};
