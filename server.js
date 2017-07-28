const path = require('path');
const chalk = require('chalk');

const MainApp = require('./app');
// const Watcher = require('./watcher');

/**
 * Init server
 * @param {app} your main express app
 * @param {adminApp} your admin app
 */
exports.initApp = (app, port) => {
    // Config app before init
    app.set('rootDir', __dirname);
    app.set('port', port);
    app.set('frontDir', path.join(__dirname, 'front'));

    // Start main app
    MainApp.init(app);
};

exports.initServer = (server, port) => {
    server.listen(port, () => {
        console.log(chalk.green('✓ Server is starting at %s'), `http://${server.address().address}:${server.address().port}`);
    });
};

/**
 * stop server
 */
exports.endServer = (server) => {
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
};

