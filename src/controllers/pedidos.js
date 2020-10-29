const {Op} = require('sequelize')
const {Pedido} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")

exports.eliminarPedido = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedido = await Pedido.findByPk(req.body.id, {
        attributes: [
            "id",
            "fecha",
            "total",
            "cancelado",
        ]
    });

    pedido.cancelado = true
    pedido.save()

    res.status(200).json({ success: true, data:{} });
})