const {Op} = require('sequelize')
const {
    Pedido,
    PedidoCliente,
    DetallePedido,
} = require('../sequelize')
    
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

exports.getPedidosAdeudados = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    let pedidos = await PedidoCliente.findAll({
        attributes: [
            "id",
            "montoSaldado",
            "entregado",
            "pagado"
        ],
        include: [
            { model: Pedido, attributes: ["id", "fecha", "total", "cancelado"]},
        ],
        where: {
            pagado: false,
            entregado: true
        }
    });

    return res.status(200).json({ success: true, data: pedidos });
})

/*
exports.getPedidosAdeudados = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    let pedidos = await Pedido.findAll({
        attributes: [
            "id",
            "fecha",
            "total",
            "cancelado",
        ],
        include: [
            { model: PedidoCliente, attributes: ["entregado", "pagado"]},
            { model: DetallePedido, attributes: ["cantidad", "subtotal"]},
        ],
        where: {
            pagado: false
        }
    });

    return res.status(200).json({ success: true, data: pedidos });
})

*/