const clientFiles = [
    'public/**/*',
    'views/**/*',
];

/**
 * browser-sync configs
 */
module.exports = {
    proxy: 'http://localhost:3000',
    files: clientFiles,
    port: 4000,
};
