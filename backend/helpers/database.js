const path = require('path');
const debug = require('debug')('myshop:db');
const { Sequelize } = require('sequelize');
const productsModel = require('./../models/products');

module.exports = async () => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../shop.sqlite'),
    });

    try {
        await sequelize.authenticate();
        debug('Connection has been established successfully.');
    } catch (error) {
        debug(`Unable to connect to the database: ${error.message}`);
        throw error;
    }

    productsModel(sequelize);
    await sequelize.sync();

    /*await sequelize.models.Product.create({
        name: 'Dell keyboard',
        description: 'OEM Dell keyboard equipped with SmartCard reader. Color black.',
        photo: 'dell_kb.png',
        price: 32.5,
    });*/

    return sequelize;
};
