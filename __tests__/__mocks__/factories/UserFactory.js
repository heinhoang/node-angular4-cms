import faker from 'faker';

import BaseFactory from './BaseFactory';

class UserFactory extends BaseFactory {
    /**
     * Create a user
     *
     * @public
     * @param {Object} attrs of user
     * @returns {Object} a fake user
     */
    generate(attrs) {
        return {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: 'password1',
            role: 'admin',
            ...attrs,
        };
    }
}

module.exports = new UserFactory();
