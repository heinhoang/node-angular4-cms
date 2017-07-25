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
exports.crudGetAll = (Model, queryOpts, fields, sortedFields) =>
    Model.find(queryOpts).select(fields).sort(sortedFields).execAsync();


/**
 * Check for duplicate entries
 */
exports.checkForDuplicateEntry = (Model, queryOpts) => Model.count(queryOpts).execAsync();
