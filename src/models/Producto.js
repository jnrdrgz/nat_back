const { Sequelize } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Producto", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        descripcion:{
            type: DataTypes.STRING,
            allowNull: false,    
        },
        codigo:{
            type: DataTypes.BIGINT,
            allowNull: true, 
        },
        puntos:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        stock:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.0
        },
        precio:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.0
        },
        precioCosto:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.0
        },
        foto: {
            type: DataTypes.STRING,
            defaultValue: "https://res.cloudinary.com/dy5tuirk1/image/upload/v1605068028/j9z0pfqs8zros1kh23do.jpg"
        },
        estaEliminado:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    })
}
