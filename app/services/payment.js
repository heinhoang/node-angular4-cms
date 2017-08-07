const HTTPStatus = require('http-status');

const { createPaypalPayment, totalPayment } = require('../utils/payment-helpers');


/**
 * expected body like this:
 * list[items][0][name]
 * list[items][1][sku]
 * list[items][0][name]
 * list[items][1][sku]
 */
exports.pay = (req, res, next) => {
    // get item list from body parser
    const itemList = req.body.list;
    // get full web url
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const configs = {
        host: 'api.sandbox.paypal.com',
        port: '',
        client_id: process.env.PAYPAL_CLIENT_ID,
        client_secret: process.env.PAYPAL_CLIENT_SECRET,
    };
    // additional options
    const paypalOpts = {
        redirect_urls: {
            return_url: `${url}/execute`,
            cancel_url: `${url}/cancel`,
        },
        transactions: [{
            // item_list: itemList,
            amount: {
                currency: `${req.body.currency}`,
                total: totalPayment(itemList.items),
            },
            description: 'You have purchase something on our site.',
        }],
    };
    createPaypalPayment(paypalOpts, configs)
        .then((payment) => {
            if (payment.payer.payment_method === 'paypal') {
                req.payment.id = payment.id;
                let redirectUrl;
                for (let i = 0; i < payment.links.length; i += 1) {
                    const link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                        break;
                    }
                }
                req.payment.redirectUrl = redirectUrl;
            }
            next();
        })
        .catch(e => res.next(e));
};
