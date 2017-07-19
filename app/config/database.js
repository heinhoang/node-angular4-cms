const mongoose = require('mongoose');
const Promise = require('bluebird');
const chalk = require('chalk');

const Database = {};

/**
 * Init mongoose database
 */
Database.init = () => {
    mongoose.Promise = Promise;

    const mongooseOpts = {
        username: 'demouser',
        password: '123',
        host: 'localhost',
        port: 27017,
        dbName: 'nodejs-start-app',
    };
    const dbUrl = `mongodb://${mongooseOpts.username}:${mongooseOpts.password}@${mongooseOpts.host}:${mongooseOpts.port}/${mongooseOpts.dbName}`;

    // database connection
    try {
        // for mongoose bellow 4.11.0
        mongoose.connect(dbUrl);
    } catch (err) {
        // for mongoose >= 4.11.0
        mongoose.createConnection(dbUrl);
    }

    mongoose.connection
        .once('open', () => {
            console.log(chalk.green('✓ MongoDB is running'));
        })
        .on('error', () => {
            console.log(chalk.red('MongoDB Connection Error. Please make sure that MongoDB is running & you have privileges to access.'));
            process.exit(1);
        });
};

module.exports = Database;
