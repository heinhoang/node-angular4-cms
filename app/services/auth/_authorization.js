const Acl = require('acl');

/**
 * Define roles, resources and permissions
 */
function setRoles(theAcl) {
    theAcl.allow([
        {
            roles: 'admin',
            allows: [
                { resources: '*', permissions: '*' },
            ],
        },
        {
            roles: 'editor',
            allows: [
                { resources: ['/', '/posts', '/users'], permissions: ['get', 'post', 'put', 'delete'] },
            ],
        },
        {
            roles: 'guest',
            allows: [
                { resources: ['/', '/posts', '/users'], permissions: ['get', 'post', 'put', 'delete'] },
            ],
        },
    ]);

    // Inherit roles
    //  Every user is allowed to do what guests do
    //  Every admin is allowed to do what users do
    theAcl.addRoleParents('editor', 'guest');
    theAcl.addRoleParents('admin', 'editor');
    // make all users that are not signed in (i.e. id=0) guests
    theAcl.addUserRoles(0, 'guest', () => {
        console.log('llll');
    });
    theAcl.hasRole('heinhoang', 'user', (err, hasRole) => {
        console.log(hasRole);
    });

    return theAcl;
}

/**
 * Gets the ID from currently logged in user
 */
function getUserById(request) {
    const userId = request.user && request.user.id.toString();
    return userId || false;
}

// Generic debug logger for node_acl
function logger() {
    return {
        debug: (msg) => {
            console.log('-DEBUG-', msg);
        },
    };
}

// Main object
const Authorization = {};
Authorization.acl = null;

/**
 * Implement Acl middleware to use in routes
 */
Authorization.aclMiddleware = function aclMiddleware(acl) {
    acl.middleware(1, getUserById);
};

/**
 * Init Acl for authorization, working only after mongoose is connected
 */
let firstInit = true;
Authorization.init = function init(dbInstance, prefix = null) {
    if (firstInit === true) {
        // init just one time
        firstInit = false;
        const { mongodbBackend: AclMongo } = Acl;
        const acl = new Acl(new AclMongo(dbInstance, prefix), logger());
        Authorization.acl = setRoles(acl);
        return Authorization;
    }
    return null;
};

module.exports = Authorization;
