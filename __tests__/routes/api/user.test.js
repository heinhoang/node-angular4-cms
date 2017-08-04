const { expect } = require('chai');

const { API_VERSION } = require('../../../app/constants');
const server = require('../../__mocks__/ServerMock');
const User = require('../../../app/models/User');
const UserFactory = require('../../__mocks__/factories/UserFactory');

const ENDPOINT = `/api/${API_VERSION}/users`;

let testUser;
describe(`GET ${ENDPOINT}`, () => {
    before((done) => {
        User.removeAsync()
            .then(() => User.createAsync(UserFactory.generate())
                .then((user) => {
                    testUser = user.toJSON();
                    console.log({ aaa: 'ddd', testUser });
                    done();
                }));
    });
    describe('Get all users with status 200', () => {
        console.log({ aaa: 'fff', testUser });
        it('should return the _id of the user and a token', (done) => {
            server
                .get(ENDPOINT)
                .set('Authorization', `JWT ${testUser.token}`)
                .end((err, res) => {
                    const { status, body } = res;
                    expect(status).to.equal(200);
                    expect(body).to.haveOwnProperty('_id');
                    expect(body).to.haveOwnProperty('token');
                    done();
                });
        });
    });
});
