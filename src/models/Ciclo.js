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
        puntosNecesarios:{
            type: DataTypes.BIGINT,
            defaultValue: 0,
            allowNull: true,    
        },
        //auto calculado si dan las fechas?
        actual:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        estaEliminado:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    })
}