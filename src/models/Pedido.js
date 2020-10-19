const { Sequelize } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Pedido", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        fecha:{
            type:DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        total:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.0,
            allowNull: false,
        },
        cancelado:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
}