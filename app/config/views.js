const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const HbsHelpers = require('../utils/handlebars-helpers');

/**
 * Setup view engines and static assets
 * @param {app} express app
 */
exports.init = (app) => {
    const rootDir = app.get('rootDir');
    const frontDir = app.get('frontDir');
    const hbs = exphbs.create({
        defaultLayout: 'main',
        layoutsDir: `${frontDir}/views/layouts`,
        partialsDir: `${frontDir}/views/partials`,
        extname: '.hbs',
        helpers: HbsHelpers.init(),
    });

    app.set('views', path.join(frontDir, '/views'));
    app.engine('hbs', hbs.engine);
    app.engine('html', hbs.engine);
    app.set('view engine', 'hbs');
    app.set('port', process.env.PORT || 3000);

    app.use(express.static(`${rootDir}/public`));
};
