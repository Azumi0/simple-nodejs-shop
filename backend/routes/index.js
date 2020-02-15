const { Router } = require('express');

/**
 * Create main router
 *
 * @param {TwingEnvironment} renderer
 * @param {Sequelize} db
 * @returns {Router}
 */
module.exports = (renderer, db) => {
    const router = Router();

    router.get('/', async (req, res) => {
        const renderData = { name: 'World' };
        renderData.products = await db.models.Product.findAll();

        const output = await renderer.render('index.twig', renderData);
        res.end(output);
    });

    return router;
};
