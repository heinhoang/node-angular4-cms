const Promise = require('bluebird');

const { join } = Promise;

/**
 * Support create to save new model into database
 */
// exports.create = (Model, successMsg) => new Promise((resolve, reject) => (
//     Model.save(err => (err ? reject(err) : resolve(successMsg)))
// ));
exports.create = (Model, bodyOpts) => Model.createAsync(bodyOpts);

/**
 * Helper to get database collection
 */
// exports.crudGetAll = (Model, { found, limited, fields, sorted }) =>
//     Model
//         .find(found)
//         .limit(limited)
//         .select(fields)
//         .sort(sorted)
//         .exec();

/**
 * Helper to get database collection with pagination options
 * @param {object} Model mongoose model to get data
 * @param {object} Options contains { findOpts, selectOpts, sortOpts, pagerOpts }
 * @returns {object} result includes { pager: { total, curentPage }, data }
 */
exports.getWithPager = (Model, {
    findOpts,
    selectOpts,
    sortOpts,
    pagerOpts,
}) => join(
        Model
            .find(findOpts)
            .select(selectOpts)
            .skip(pagerOpts.perPage * (pagerOpts.page - 1))
            .limit(pagerOpts.perPage)
            .sort(sortOpts)
            .execAsync(),
        Model.count(findOpts).execAsync())
        .spread((data, count) => ({
            pager: {
                total: count,
                curentPage: pagerOpts.page,
            },
            data,
        }));

exports.getById = (Model, { modelId, selectOpts }) => {
    if (modelId === 'guest') {
        return new Promise(resolve => resolve(null));
    }
    return Model.findByIdAsync(modelId, selectOpts);
};

/**
 * find one document
 * @param {object} Model mongoose model
 * @param {object} options { query, fields }
 * - query is query to find. Such as, `{ name: 'admin' }`
 * - fields to return. Such as, `'firstName lastName'`
 * @return {Promise} mongoose document needed
 */
exports.getOne = (Model, { query, fields }) => Model.findOneAsync(query, fields);
exports.getOneSync = (Model, { query, fields }) => Model.findOne(query, fields);

/**
 * Check for duplicate entries
 */
// exports.checkForDuplicateEntry = (Model, queryOpts) => Model.count(queryOpts).execAsync();
