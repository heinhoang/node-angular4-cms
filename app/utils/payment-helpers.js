const dbConnection = require('mongoose').connection;
const Promise = require('bluebird');
const paypal = require('paypal-rest-sdk');

/**
 * create paypal payment. This is an implement of paypal create: https://github.com/paypal/PayPal-node-SDK/blob/master/samples/order/create.js
 * @param {object} opts create options
 * @returns {Promise}
 */
exports.createPaypalPayment = (opts, configs) => {
    const preOpts = {
        intent: 'authorize',
        payer: {
            payment_method: 'paypal',
        },
    };
    const paymentOpts = Object.assign({}, preOpts, opts);
    // const createAsync = Promise.promisify(paypal.payment.create);
    // return createAsync(paymentOpts, configs);
    return new Promise((resolve, reject) => paypal.payment.create(paymentOpts,
        configs,
        (err, payment) => {
            if (err) {
                return reject(err);
            }
            return resolve(payment);
        }));
    // paypal.payment.create(paymentOpts, configs, (err, res) => {
    //     if (err) { console.log(JSON.stringify(err)); } else { console.log(JSON.stringify(res)); }
    // });
};

/**
 * Create total amount of payment
 * @param {Array} items array of items (products in shopping cart)
 * @returns {Number} total amount of payment
 */
exports.totalPayment = (items) => {
    let total = 0;

    for (let i = 0; i < items.length; i += 1) {
        const {
            amount = 0,
            price = 0,
            discount = 0,
        } = items[i];
        total += +amount * +price * (1 - +discount);
    }
    if (total < 0) {
        return new Error('The amount can\'t less than 0');
    }
    return total;
};

