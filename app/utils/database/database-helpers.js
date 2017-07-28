const Promise = require('bluebird');

/**
 * Support create to save new model into database
 */
exports.crudCreate = (Model, successMsg) => new Promise((resolve, reject) => (
    Model.save(err => (err ? reject(err) : resolve(successMsg)))
));

/**
 * Helper to get database collection
 */
exports.crudGetAll = (Model, queries, fields, sorted) =>
    Model.find(queries).select(fields).sort(sorted).execAsync();


/**
 * Check for duplicate entries
 */
exports.checkForDuplicateEntry = (Model, queryOpts) => Model.count(queryOpts).execAsync();
