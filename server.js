const path = require('path');
const chalk = require('chalk');

const MainApp = require('./app');
// const Watcher = require('./watcher');

/**
 * Init server
 * @param {app} your main express app
 * @param {adminApp} your admin app
 */
exports.init = (server, app, port) => {
    // Config app before init
    app.set('rootDir', __dirname);
    app.set('port', port);
    app.set('frontDir', path.join(__dirname, 'front'));

    // Start main app
    MainApp.init(app);

    // make sure we don't run a second instance
    server.listen(port, () => {
        console.log(chalk.green('✓ App is starting at %s'), `http://${server.address().address}:${server.address().port}`);
    });

    // Watch for file change
    // if (app.get('env') !== 'production') {
    //     Watcher.init(app);
    // }
};

/**
 * stop server
 */
exports.end = (server) => {
    process.on('SIGTERM', () => {
        server.close(() => {
            process.exit(0);
        });
    });
};

