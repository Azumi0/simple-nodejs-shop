const debug = require('debug')('myshop:mailer');
const nodemailer = require('nodemailer');
const config = require('./config');

const getTransport = async () => {
    if (config.useEtheralEmail) {
        const testAccount = await nodemailer.createTestAccount();

        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    return nodemailer.createTransport(config.mailer);
};

module.exports = class Mailer {
    /**
     * Create local mailer class
     *
     * @param {TwingEnvironment} renderer
     */
    constructor(renderer) {
        this.renderer = renderer;
    }

    /**
     * Send e-mail message
     *
     * @param {string} template
     * @param {object} params
     * @param {string} subject
     * @param {string} receiver
     * @returns {Promise<string>}
     */
    async send(template, params, subject, receiver) {
        const transporter = await getTransport();
        const output = await this.renderer.render(template, params);
        const info = await transporter.sendMail({
            from: config.mailerSender,
            to: receiver,
            subject, // Subject line
            text: 'You need a mail client with HTML enabled to properly view this message', // plain text body
            html: output,
        });

        if (config.useEtheralEmail) {
            debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }

        return info.messageId;
    }
};
