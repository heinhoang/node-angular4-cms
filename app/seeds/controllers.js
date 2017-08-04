const HTTPStatus = require('http-status');
const Promise = require('bluebird');
const faker = require('faker');

const datas = require('./datas');
const User = require('../models/User');
const Role = require('../models/Role');

const Models = { User, Role };

/**
 * Seed data to data base
 * @param {data} fake data
 */
function seed(data) {
    const seeds = [...data.samples];
    const Model = Models[data.model];

    if (typeof data.fakeData === 'function') {
        Array.from({ length: data.fakeCount || 10 }).map(() => {
            const fakeSeed = data.fakeData(faker);
            return seeds.push(fakeSeed);
        });
    }

    // return Model.removeAsync()
    //     .then(() => Model.insertManyAsync(seeds))
    //     .catch(err => console.log(err));
    Model.remove((err) => {
        if (err) console.log('can\'t remove');
    });
    Model.create(seeds);
}

/**
 * Seed all coolections into database
 */
exports.seedAll = (req, res, next) => {
    const promises = [];
    for (let i = 0; i < datas.length; i += 1) {
        promises.push(seed(datas[i]));
    }

    Promise.all(promises)
        .then(() => res
            .status(HTTPStatus.OK)
            .send('seed success!'))
        .catch((err) => {
            const e = err;
            e.status = HTTPStatus.BAD_REQUEST;
            return next(e);
        });
};

/**
 * Clear database
 * @param {data} fake data
 */
function clear(data) {
    const Model = Models[data.model];
    return Model.removeAsync();
}

/**
 * Clear all coolections into database
 */
exports.clearAll = (req, res, next) => {
    const promises = [];
    for (let i = 0; i < datas.length; i += 1) {
        promises.push(clear(datas[i]));
    }

    Promise.all(promises)
        .then(() => res
            .status(HTTPStatus.OK)
            .send('clear success!'))
        .catch((err) => {
            const e = err;
            e.status = HTTPStatus.BAD_REQUEST;
            return next(e);
        });
};
