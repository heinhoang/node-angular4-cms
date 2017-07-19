const i18next = require('i18next');
const Middleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');

const Locale = {};

const preloadOpts = ['en', 'de'];

const detectionOpts = {
    // order and from where user language should be detected
    order: ['querystring', 'cookie', 'header'],
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    // lookupSession: 'lng',
    lookupPath: 'lng',
    lookupFromPathIndex: 0,
    // cache user language
    caches: false, // ['cookie']
    // optional expire and domain for set cookie
    // cookieExpirationDate: new Date(),
    // cookieDomain: 'myDomain'
};

/**
 * Config i18next
 */
function i18nextConfig(localeDir) {
    const backendOpts = {
        // path where resources get loaded from
        loadPath: `${localeDir}/{{lng}}/{{ns}}.json`,
        // path to post missing resources
        addPath: `${localeDir}/{{lng}}/{{ns}}.missing.json`,
        // jsonIndent to use when storing json files
        jsonIndent: 2,
    };
    return i18next
        .use(Middleware.LanguageDetector)
        .use(Backend)
        .init({
            fallbackLng: 'en',
            preload: preloadOpts,
            detection: detectionOpts,
            ns: ['glossary', 'common'],
            defaultNS: 'glossary',
            backend: backendOpts,
        });
}

Locale.init = (app) => {
    const localeDir = `${app.get('appDir')}/locales`;
    i18nextConfig(localeDir);
    // use middleware
    app.use(Middleware.handle(i18next, {
        // ignoreRoutes: ['/foo'],
        removeLngFromUrl: false,
    }));
};

module.exports = Locale;
