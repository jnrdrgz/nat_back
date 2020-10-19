const { Sequelize } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Ciclo", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        fechaInicio:{
            type:DataTypes.DATE,
            allowNull: true, 
            defaultValue: DataTypes.NOW
        },
        fechaFin:{
            type:DataTypes.DATE,
            allowNull: true, 
            defaultValue: DataTypes.NOW
        },
        numero:{
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,    
        },
        estaEliminado:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    })
}