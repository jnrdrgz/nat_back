const {Op,QueryTypes} = require('sequelize')
const {
    Pedido,
    Cliente,
    DetallePedido,
    PedidoCliente,
    Producto,
    Ciclo,
    Balance,
    sequelize
} = require('../sequelize')

const asyncHandler = require("../middlewares/asyncHandler")

exports.agregarPedidoCliente = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedido = await PedidoCliente.create(req.body, {include: [
        {association: PedidoCliente.Cliente},
        {association: PedidoCliente.Pedido, include: [
            {association: Pedido.DetallePedido,
                include: [{association: DetallePedido.Producto}]}, 
                {association: Pedido.Ciclo}
        ]}
    ]});

    let total_pedido = 0
    await Promise.all(
        pedido.Pedido.DetallePedidos.map(async dp => {
            if(dp.Producto){
                dp.subtotal = dp.cantidad * dp.Producto.precio
                total_pedido += dp.subtotal
                await dp.save()
                
            } else {
                const producto = await Producto.findOne({
                    attributes: [
                        "precio",
                        "precioCosto",
                    ],
                    where: {
                        id: dp.ProductoId
                    }
                })

                dp.subtotal = dp.cantidad * producto.precio
                await dp.save()
                total_pedido += dp.subtotal
            }
        })
    )

    pedido.Pedido.total = total_pedido
    await pedido.Pedido.save()

    await pedido.save();

    res.status(200).json({ success: true, data:pedido });
})

//cancelar?
exports.cancelarPedido = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    res.status(200).json({ success: true, data:{} });
})


exports.getAllPedidoCliente = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    let pedidos = await PedidoCliente.findAll({
        attributes: [
            "id",
            "montoSaldado",
            "entregado",
            "pagado"
        ],
        include: [
            { model: Cliente, attributes: ["nombre"] },
            { model: Pedido, attributes: ["total"],
                include: [{
                    model: DetallePedido, attributes: ["cantidad", "subtotal"],
                    include: [{model: Producto, attributes: ["descripcion", "precio", "precioCosto"]}]
                }]
            }
        ],
    });

    return res.status(200).json({ success: true, data: pedidos });

})

exports.marcarPedidoEntregado = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedEntregado = await PedidoCliente.findByPk(req.body.id, {
        attributes: [
            "id",
            "montoSaldado",
            "entregado",
            "pagado"
        ], include: [
            {association: PedidoCliente.Cliente},
            {association: PedidoCliente.Pedido, include: [
                {association: Pedido.DetallePedido,
                    include: [{association: DetallePedido.Producto}]}
            ]}
        ],


    });

    await Promise.all(
        pedEntregado.Pedido.DetallePedidos.map(async (dp) => {
                await Producto.decrement('stock',
                    { by: dp.cantidad, where: { id: dp.ProductoId }
                })
        })
    );

    pedEntregado.entregado = true
    await pedEntregado.save()

    res.status(200).json({ success: true, data:{} });
})

exports.marcarPedidoPagado = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedidoCl = await PedidoCliente.findByPk(req.body.id, {
        attributes: [
            "id",
            "montoSaldado",
            "entregado",
            "pagado"
        ], include: [
            { model: Pedido, attributes: ["total"], 
                include: [{ 
                    model: DetallePedido, attributes: ["cantidad", "subtotal"],
                    include: [{model: Producto, attributes: ["id", "descripcion", "precio", "precioCosto"]}] 
                }, {model: Ciclo, attributes: ["id"],}] 
            }
        ],
    });

    if(!pedidoCl.pagado){
    
        //await Balance.increment("ingresos", 
        //    { by: pedidoCl.Pedido.total, where: { CicloId: pedidoCl.Pedido.Ciclo.id } 
        //})
    }

    pedidoCl.pagado = true
    await pedidoCl.save()

    res.status(200).json({ success: true, data:pedidoCl});
})

