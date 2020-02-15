const empty = require('locutus/php/var/empty');
const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const { Op } = require('sequelize');
const ResponseHelper = require('../helpers/response');

/**
 * Create router for Cart
 *
 * @param {TwingEnvironment} renderer
 * @param {Sequelize} db
 * @returns {Router}
 */
module.exports = (renderer, db) => {
    const router = Router();

    router.get('/', async (req, res) => {
        const renderData = {};

        if (!empty(req.session.shoppingCart)) {
            renderData.products = await db.models.Product.findAll({
                where: {
                    id: {
                        [Op.in]: req.session.shoppingCart,
                    },
                },
            });
        }

        const output = await renderer.render('cart.twig', renderData);
        res.end(output);
    });

    router.post('/add', async (req, res) => {
        const { productId } = req.body;

        if (!productId) {
            ResponseHelper.errorResponse(res, HttpStatus.BAD_REQUEST, 'Provide product ID to add to cart');
            return;
        }

        const product = await db.models.Product.findByPk(productId);

        if (product === null) {
            ResponseHelper.errorResponse(res, HttpStatus.BAD_REQUEST, 'Invalid product ID');
            return;
        }

        if (empty(req.session.shoppingCart)) req.session.shoppingCart = [];

        req.session.shoppingCart.push(productId);

        ResponseHelper.modelResponse(res, { message: 'Product added to cart' }, HttpStatus.OK);
    });

    router.post('/remove', async (req, res) => {
        const { productId } = req.body;

        if (!productId) {
            ResponseHelper.errorResponse(res, HttpStatus.BAD_REQUEST, 'Provide product ID to remove from cart');
            return;
        }

        if (!empty(req.session.shoppingCart)) {
            const cartCopy = [...req.session.shoppingCart];
            const idIndex = cartCopy.indexOf(productId);

            if (idIndex > -1) {
                cartCopy.splice(idIndex, 1);
                req.session.shoppingCart = cartCopy;
            }
        }

        ResponseHelper.modelResponse(res, { message: 'Product removed from cart' }, HttpStatus.NO_CONTENT);
    });

    return router;
};
