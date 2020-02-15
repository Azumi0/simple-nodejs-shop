const { DataTypes } = require('sequelize');

module.exports = sequelize => {
    return sequelize.define('Products', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
