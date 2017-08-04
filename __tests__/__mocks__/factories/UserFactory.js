const faker = require('faker');

const BaseFactory = require('./BaseFactory');

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
            email: faker.internet.email().toLowerCase(),
            password: 'password1',
            ...attrs,
        };
    }
}

module.exports = new UserFactory();
