const HTTPStatus = require('http-status');

const MailProvider = require('../models/Mailer');
const { getOneSync } = require('../utils/database/database-helpers');
const { sendMail } = require('../utils/mailer-helpers');

const mailProvider = getOneSync(MailProvider, { query: { default: true }, fields: 'providerType' }) || {};
const {
    host = undefined,
    port = undefined,
    secure = undefined,
    authUserName = process.env.MAILGUN_USERNAME,
    authPassword = process.env.MAILGUN_PASSWORD,
    // pool = undefined,
    apiKey = process.env.MAILGUN_API_KEY,
    apiSecret = undefined,
    // apiUser = undefined,
    domain = process.env.MAILGUN_DOMAIN,
    rateLimit = 5,
} = mailProvider;

const providerConfigs = {
    amazon: {
        opts: {
            accessKeyId: apiKey,
            secretAccessKey: apiSecret,
            rateLimit, // ex: 5 messages in a second
        },
    },
    mailgun: {
        opts: {
            auth: {
                api_key: apiKey,
                domain,
            },
        },
    },
    sendgrid: {
        opts: {
            auth: {
                api_key: apiKey,
            },
        },
    },
    normal: {
        host,
        port,
        secure, // use SSL
        auth: {
            user: authUserName,
            pass: authPassword,
        },
    },
    mandrill: {
        auth: {
            apiKey,
        },
    },
    postmark: apiKey,
};

/**
 * send email middleware
 */
exports.mailer = (req, res, next) => {
    const provider = mailProvider.providerType || process.env.MAIL_PROVIDER;
    console.log(provider && req.body && req.body !== {});
    if (provider) {
        const mailOpts = req.body;
        const providerOpts = providerConfigs[provider].opts;
        console.log(JSON.stringify(providerOpts));
        console.log(JSON.stringify(mailOpts));
        sendMail(provider, providerOpts, mailOpts)
            .then(result => res.json(JSON.stringify({ message: 'sent mail success', result })))
            .catch(e => res.json(JSON.stringify(e)));
    } else {
        next({ error: HTTPStatus.INTERNAL_SERVER_ERROR, message: 'Email provider was not set' });
    }
};

// exports.mailer = (req, res) => {
//     console.log(providerConfigs.mailgun.opts);
//     const nodemailerMailgun = nodemailer.createTransport(mailGunTransport(providerConfigs.mailgun.opts));
//     console.log(req.body);
//     nodemailerMailgun.sendMail(req.body, (err, info) => {
//         if (err) {
//             res.json(JSON.stringify({ Error: 'error', err }));
//         } else {
//             res.json(JSON.stringify({ msg: 'success', info }));
//         }
//     });
// };
