const {Op,QueryTypes} = require('sequelize')
const {
    Pedido,
    DetallePedido,
    Producto,
    PedidoProveedor,
    Balance,
    Ciclo,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")


exports.marcarPedidoProveedorRecibido = asyncHandler(async (req, res, next) => {
    console.log(req.body.id)
    let pedido = await PedidoProveedor.findByPk(req.body.id, {
        attributes: [
            "id",
            //recibido //agregar a modelo
        ],
        include: [
            { model: Pedido, attributes: ["total"], 
                include: [{ 
                    model: DetallePedido, attributes: ["cantidad", "subtotal"],
                    include: [{model: Producto, attributes: ["id", "descripcion", "precio", "precioCosto"]}] 
                }, {model: Ciclo, attributes: ["id"],}] 
            }
        ],
    });
    
    console.log(pedido.toJSON())

    //if pedido not recibido
    if(!pedido.recibido){
        await Promise.all(
            pedido.Pedido.DetallePedidos.map(async (dp) => {
                    await Producto.increment('stock', 
                        { by: dp.cantidad, where: { id: dp.Producto.id } 
                    },
                  )
            })
        );

        await Balance.increment("egresos", 
            { by: pedido.Pedido.total, where: { CicloId: pedido.Pedido.Ciclo.id } 
        })
    }

    // agregar a modelo
    pedido.recibido = true
    pedido.save()
    return res.status(200).json({ success: true, data: pedido });
})

exports.agregarPedidoProveedor = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedidoProv = await PedidoProveedor.create(req.body, {include: [
        {association: PedidoProveedor.Pedido, include: [
            {association: Pedido.DetallePedido,
                include: [{association: DetallePedido.Producto}]}
        ]}
    ]});

    console.log(  pedidoProv.Pedido.DetallePedidos[0].toJSON())

    let total_pedidopv = 0
    await Promise.all(
        pedidoProv.Pedido.DetallePedidos.map(async dp => {
            if(dp.Producto){
                dp.subtotal = dp.cantidad * dp.Producto.precio
                total_pedidopv += dp.subtotal
            } else {
                const producto = await Producto.findOne({
                    attributes: [
                        "precio",
                    ],
                    where: {
                        id: dp.ProductoId
                    }
                })

                dp.subtotal = dp.cantidad * producto.precio
                await dp.save()

                total_pedidopv += dp.subtotal
            }
        })
    )

    pedidoProv.Pedido.total = total_pedidopv
    await pedidoProv.Pedido.save()


    
    if(req.body.recibido){
        //cargar stock
        //pedidoProv
        await Promise.all(
            pedidoProv.Pedido.DetallePedidos.map(async (dp) => {
                    await Producto.increment('stock', 
                        { by: dp.cantidad, where: { id: dp.ProductoId } 
                    },
                  )
            })
        );
        
    }

    await pedidoProv.save()

    
    res.status(200).json({ success: true, data:pedidoProv });
})


exports.getAllPedidoProveedor = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    let pedidosprov = await PedidoProveedor.findAll({
        attributes: [
            "id", 
            "recibido",
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

    return res.status(200).json({ success: true, data: pedidosprov });

})
