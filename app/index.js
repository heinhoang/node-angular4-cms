const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.load();

// Configs
const Database = require('./config/database');
const Middlewares = require('./config/middlewares');
const Passport = require('./config/passport');
const Locale = require('./config/locale');
const Views = require('./config/views');
// Router
const AppRouter = require('./router');

const App = {};

/**
 * init main app
 * @param {app} express app from server
 */
App.init = (app) => {
    app.set('appDir', __dirname);

    // passport config
    Passport.init();

    // database config
    Database.init();

    // middlewares setup
    Middlewares.init(app);

    // Locale setup
    Locale.init(app);

    // views engine setup
    // const hbs = exphbs.create({
    Views.init(app);

    // routing setup
    app.use(AppRouter.init());

    // Production error handler
    if (app.get('env') === 'production') {
        app.use((err, req, res) => {
            console.error(err.stack);
            res.sendStatus(err.status || 500);
        });
    }
};

module.exports = App;