const supertest = require('supertest');
// const chai = require('chai');
// const chaiHttp = require('chai-http');

const Server = require('../../index');

// chai.use(chaiHttp);

module.exports = supertest(Server);
