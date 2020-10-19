const { Sequelize } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Cliente", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""    
        },
        numeroTelefono:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""    
        }
    })
}
