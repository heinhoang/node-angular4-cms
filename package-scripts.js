require('dotenv').config();
const { series, crossEnv } = require('nps-utils');

module.exports = {
    scripts: {
        test: {
            default: `${crossEnv('NODE_ENV=test')} mocha ./__tests__/**/*.test.js --timeout 15000 --colors --compilers js:babel-register`,
            watch: series.nps('test -w'),
        },
    },
};
