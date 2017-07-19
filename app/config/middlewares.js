// const morgan = require('morgan');
const compression = require('compression');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport = require('passport');
// const winston = require('winston');
// const expressWinston = require('express-winston');
const cors = require('cors');
const helmet = require('helmet');
const monitor = require('express-status-monitor');

const Middlewares = {};

/**
 * config winston
 */
// const winstonInstance = new winston.Logger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true,
//         }),
//     ],
// });

Middlewares.init = (app) => {
    // const isDev = app.get('env') === 'development';
    const isProp = app.get('env') === 'production';
    const isTest = app.get('env') === 'test';

    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(expressValidator());
    // override with POST having ?_method=PUT
    app.use(methodOverride('_method'));
    app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());
    app.use(cors());
    app.use(monitor());
    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
    if (!isProp && !isTest) {
        // app.use(morgan('dev'));
        // expressWinston.requestWhitelist.push('body');
        // expressWinston.responseWhitelist.push('body');
        // app.use(
        //     expressWinston.logger({
        //         winstonInstance,
        //         meta: true,
        //         msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        //         colorStatus: true,
        //     }));
    }
};

module.exports = Middlewares;
