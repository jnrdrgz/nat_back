const { Sequelize } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Cuota", {
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
        monto:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
    })
}

