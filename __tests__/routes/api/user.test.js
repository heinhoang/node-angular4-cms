const { expect } = require('chai');

const { API_VERSION } = require('../../../app/constants');
const server = require('../../__mocks__/ServerMock');
const User = require('../../../app/models/User');
const UserFactory = require('../../__mocks__/factories/UserFactory');

const ENDPOINT = `/api/${API_VERSION}/users/signup`;

describe(`POST ${ENDPOINT}`, () => {
    before((done) => {
        User.removeAsync()
            .then(() => {
                User.create(UserFactory.generate());
                done();
            })
            .catch(e => done(e));
    });
    describe('Create with status 201', () => {
        it('should return the _id of the user and a token', (done) => {
            server
                .post(ENDPOINT)
                .send(UserFactory.generate())
                .end((err, res) => {
                    const { status, body } = res;
                    expect(status).to.equal(201);
                    expect(body).to.haveOwnProperty('_id');
                    expect(body).to.haveOwnProperty('token');
                    done();
                });
        });
        it('should return an error if email is not provided', (done) => {
            server
                .post(ENDPOINT)
                .send({ username: 'username', password: 'password1' })
                .end((err, res) => {
                    const { status, body } = res;
                    expect(status).to.equal(400);
                    // expect(body.message).to.equal('validation error');
                    // expect(body.errors.email).to.equal('email is required');
                    done();
                });
        });
        it('should return an error if password is not provided', (done) => {
            server
                .post(ENDPOINT)
                .send({ username: 'username', email: 'user@gmail.com' })
                .end((err, res) => {
                    const { status, body } = res;
                    expect(status).to.equal(400);
                    // expect(body.message).to.equal('validation error');
                    // expect(body.errors.password).to.equal('password is required');
                    done();
                });
        });
        it('should return an error if email is not a valid email', (done) => {
            server
                .post(ENDPOINT)
                .send({
                    username: 'username',
                    email: 'user@gmai',
                    password: 'password1',
                })
                .end((err, res) => {
                    const { status, body } = res;
                    expect(status).to.equal(400);
                    // expect(body.message).to.equal(
                    //     'User validation failed: email: user@gmai is not a valid email!',
                    // );
                    // expect(body.errors.email).to.equal('user@gmai is not a valid email!');
                    done();
                });
        });
        it('should return an error if password is not a good enough', (done) => {
            server
                .post(ENDPOINT)
                .send({
                    username: 'username',
                    email: 'user@gmail.com',
                    password: 'pass',
                })
                .end((err, res) => {
                    const { status, body } = res;
                    expect(status).to.equal(400);
                    // expect(body.message).to.equal('validation error');
                    // expect(body.errors.password).to.equal(
                    //     'password length must be at least 6 characters long',
                    // );
                    done();
                });
        });
    });
});
