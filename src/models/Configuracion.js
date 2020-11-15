const { Sequelize } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Configuracion", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        porcentajeGanancia:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.0
        },
    })
}
