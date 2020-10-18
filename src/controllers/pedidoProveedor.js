const {Op,QueryTypes} = require('sequelize')
const {
    Pedido,
    DetallePedido,
    Producto,
    PedidoProveedor,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")


exports.agregarPedidoProveedor = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedidoprov = await PedidoProveedor.create(req.body, {include: [
        {association: PedidoProveedor.Pedido, include: [
            {association: Pedido.DetallePedido,
                include: [{association: DetallePedido.Producto}]}
        ]}
    ]});


    console.log(pedidoprov.Pedido)
    await pedidoprov.save();

    res.status(200).json({ success: true, data:pedidoprov });
})


exports.getAllPedidoProveedor = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    let pedidosprov = await PedidoProveedor.findAll({
        attributes: [
            "id"
        ],
        include: [
            { model: Pedido, attributes: ["total", "fecha"],
                include: [{
                    model: DetallePedido, attributes: ["cantidad", "subtotal"],
                    include: [{
                      model: Producto, attributes: ["descripcion", "precio", "precioCosto"]}]
                }]
            }
        ],
    });

    pedidosprov.map(p => {
            let total_pedidopv = 0
            p.Pedido.DetallePedidos.map(dp => {
                dp.subtotal = dp.cantidad * dp.Producto.precio
                total_pedidopv += dp.subtotal
            })

            p.Pedido.total = total_pedidopv
        }
    )


    return res.status(200).json({ success: true, data: pedidosprov });

})
