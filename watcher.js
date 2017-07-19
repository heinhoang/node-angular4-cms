const chokidar = require('chokidar');
const browserSync = require('browser-sync').create();

const Watcher = {};

/**
 * Watch static files using browser-sync
 */
// Watcher.browserSync = (app) => {
//     const filesToWatch = [
//         './public/**/*',
//     ];
//     browserSync.init(null, {
//         proxy: `http://localhost:${app.get('port')}`,
//         files: filesToWatch,
//         port: 4000,
//         // browser: ['google-chrome'],
//     });
// };

/**
 * Watch files change and restart server.
 * Know more here [don't use nodemon](https://medium.com/@kevinsimper/dont-use-nodemon-there-are-better-ways-fc016b50b45e)
 */
Watcher.init = (server, app) => {
    const watcher = chokidar.watch(['./app', './front/views'], { persistent: true });

    // Browser Sync
    const filesToWatch = [
        './public/**/*',
    ];
    browserSync.init(null, {
        proxy: `http://localhost:${app.get('port')}`,
        files: filesToWatch,
        port: 4000,
        // browser: ['google-chrome'],
    });

    watcher.on('ready', () => {
        watcher.on('all', () => {
            // console.log('Clearing cache from server');
            // Object.keys(require.cache).forEach((id) => {
            //     if (/[/\\]dist[/\\]/.test(id)) delete require.cache[id];
            // });
            browserSync.reload();
            console.log('watching for app change...');
        });
    });
};

module.exports = Watcher;
