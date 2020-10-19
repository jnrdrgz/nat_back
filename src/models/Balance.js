const { Sequelize } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Balance", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        ingresos:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.0,
            allowNull: false,
        },
        egresos:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0.0,
            allowNull: false,
        },
    })
}
