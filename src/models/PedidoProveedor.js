const { Sequelize } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("PedidoProveedor", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        recibido:{
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    })
}