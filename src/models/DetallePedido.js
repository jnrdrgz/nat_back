const { Sequelize } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("DetallePedido", {
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        cantidad:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 1.0
        },
        precioUnitario:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0.0
        },
        subtotal:{
            type: DataTypes.DECIMAL(10,2),
            //allowNull: false,
            //
            defaultValue: 0.0
            //set(value) {
            //    this.setDataValue('subtotal', this.cantidad);
            //}

            //type: DataTypes.VIRTUAL,
            //get() {
            //  return this.cantidad
            //},
            //set(value) {
            //  throw new Error('Subtotal es autocalculado');
            //}
        },
    })
}
