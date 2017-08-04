const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const mailGunTransport = require('nodemailer-mailgun-transport');
const mandrillTransport = require('nodemailer-mandrill-transport');
const postmark = require('postmark');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const sesTransport = require('nodemailer-ses-transport');

const transports = {
    amazon: sesTransport,
    mailgun: mailGunTransport,
    sendgrid: sendGridTransport,
    normal: f => f,
    mandrill: mandrillTransport,
    postmark,
};

/**
 * Get Mail Provider such as mailgun, sendgrid, ...
 * @param {String} provider email provider name
 * @param {object} opts email provider options
 * @returns {Transporter}
 */
function getMailer(provider, opts) {
    return provider !== 'postmark' ?
        nodemailer.createTransport(transports[provider](opts))
        : new postmark.Client(opts);
}

/**
 * Send email based on provider provided
 * @param {String} provider email provider name
 * @param {object} opts email provider options
 * @param {object} mailOpts email options
 * expected to be
 * {
 *      "From": from@email.com,
 *      "To": to@email.com,
 *      "Subject": 'Email subject',
 *      "TextBody": 'some text',
 *      "HtmlBody": 'some HTML',
 *      "Attachments": 'file path'
 * }
 * @returns {Promise}
 */
exports.sendMail = (provider, providerOpts, mailOpts) => {
    let mailer = getMailer(provider, providerOpts);
    mailer = Promise.promisifyAll(mailer);
    return mailer.sendMailAsync(mailOpts);
    // return new Promise((resolve, reject) => {
    //     mailer.sendEmail(mailOpts, (err, data) => {
    //         if (!err) return resolve({ message: 'ggggg', data });
    //         return reject(err);
    //     });
    // });
};
