const debug = require('debug')('myshop:indexRouter');
const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const config = require('../helpers/config');
const Mailer = require('../helpers/mailer');
const ResponseHelper = require('../helpers/response');

/**
 * Create main router
 *
 * @param {TwingEnvironment} renderer
 * @param {Sequelize} db
 * @returns {Router}
 */
module.exports = (renderer, db) => {
    const router = Router();
    const mailer = new Mailer(renderer);

    router.get('/', async (req, res) => {
        const renderData = { name: 'World' };
        renderData.products = await db.models.Product.findAll();

        const output = await renderer.render('pages/index.twig', renderData);
        res.end(output);
    });

    router.get('/contact', async (req, res) => {
        const output = await renderer.render('pages/contact.twig');
        res.end(output);
    });

    router.post('/contact', async (req, res) => {
        try {
            await mailer.send('mails/contactForm.twig', req.body, 'Message from contact page', config.adminMail);
            ResponseHelper.modelResponse(res, { message: 'Message sent.' }, HttpStatus.OK);
        } catch (e) {
            debug('Error while sending message');
            debug(e.message);
            ResponseHelper.modelResponse(
                res,
                { message: 'Error while sending message' },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    });

    return router;
};
