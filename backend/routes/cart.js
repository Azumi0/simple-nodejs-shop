const debug = require('debug')('myshop:cartRouter');
const empty = require('locutus/php/var/empty');
const { Router } = require('express');
const HttpStatus = require('http-status-codes');
const { Op } = require('sequelize');
const config = require('../helpers/config');
const appConfig = require('../helpers/config');
const Mailer = require('../helpers/mailer');
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
    const mailer = new Mailer(renderer);

    const getProductsCounts = shoppingCart => {
        return shoppingCart.reduce((map, val) => {
            map[val] = (map[val] || 0) + 1;
            return map;
        }, {});
    };

    router.get('/', async (req, res) => {
        const { tax } = appConfig;
        const renderData = {
            tax,
        };

        if (!empty(req.session.shoppingCart)) {
            renderData.products = await db.models.Product.findAll({
                where: {
                    id: {
                        [Op.in]: req.session.shoppingCart,
                    },
                },
            });
            const productsCounts = getProductsCounts(req.session.shoppingCart);
            renderData.productsExtra = renderData.products.reduce((map, product) => {
                const priceForAmount = product.price * productsCounts[product.id];
                map[product.id] = {
                    count: productsCounts[product.id],
                    totalPrice: priceForAmount + priceForAmount * tax,
                };
                return map;
            }, {});
        }

        const output = await renderer.render('pages/cart.twig', renderData);
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

        ResponseHelper.modelResponse(
            res,
            { message: `Product added to cart. Products in cart: ${req.session.shoppingCart.length}` },
            HttpStatus.OK,
        );
    });

    router.post('/remove', async (req, res) => {
        const { productId } = req.body;
        const extraData = {};

        if (!productId) {
            ResponseHelper.errorResponse(res, HttpStatus.BAD_REQUEST, 'Provide product ID to remove from cart');
            return;
        }

        if (empty(req.session.shoppingCart)) {
            ResponseHelper.errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Cart is already empty');
            return;
        }

        const cartCopy = [...req.session.shoppingCart];
        const idIndex = cartCopy.indexOf(productId);

        if (idIndex > -1) {
            cartCopy.splice(idIndex, 1);
            req.session.shoppingCart = cartCopy;
        }

        if (req.session.shoppingCart.length > 0) {
            const { tax } = appConfig;
            const products = await db.models.Product.findAll({
                attributes: ['id', 'price'],
                where: {
                    id: {
                        [Op.in]: req.session.shoppingCart,
                    },
                },
            });
            const productsCounts = getProductsCounts(req.session.shoppingCart);
            extraData.fullPrice = 0;
            extraData.productsPrices = products.reduce((map, product) => {
                const priceForAmount = product.price * productsCounts[product.id];
                const totalPrice = priceForAmount + priceForAmount * tax;
                map.push({
                    id: product.id,
                    count: productsCounts[product.id],
                    price: product.price,
                    totalPrice,
                });
                extraData.fullPrice += totalPrice;
                return map;
            }, []);
        }

        ResponseHelper.modelResponse(res, { message: 'Product removed from cart', extraData }, HttpStatus.OK);
    });

    router.post('/finalize', async (req, res) => {
        try {
            const dataToSend = { ...req.body, products: [], fullPrice: 0 };
            const { tax } = appConfig;
            const products = await db.models.Product.findAll({
                where: {
                    id: {
                        [Op.in]: req.session.shoppingCart,
                    },
                },
            });
            const productsCounts = getProductsCounts(req.session.shoppingCart);
            dataToSend.products = products.reduce((map, product) => {
                const priceForAmount = product.price * productsCounts[product.id];
                const totalPrice = priceForAmount + priceForAmount * tax;
                map.push({
                    id: product.id,
                    name: product.name,
                    count: productsCounts[product.id],
                    price: product.price,
                    totalPrice,
                });
                dataToSend.fullPrice += totalPrice;
                return map;
            }, []);

            await mailer.send('mails/orderForm.twig', dataToSend, 'Order has been placed', config.adminMail);
            req.session.shoppingCart = [];
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
