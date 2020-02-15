const { Router } = require('express');

module.exports = renderer => {
    const router = Router();

    /* GET index page. */
    router.get('/', (req, res) => {
        renderer.render('index.twig', { name: 'World' }).then(output => {
            res.end(output);
        });
    });

    return router;
};
