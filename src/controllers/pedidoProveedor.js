const {Op,QueryTypes} = require('sequelize')
const {
    Pedido,
    DetallePedido,
    Producto,
    PedidoProveedor,
    Balance,
    Ciclo,
    Cuota,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")


exports.marcarPedidoProveedorRecibido = asyncHandler(async (req, res, next) => {
    console.log(req.body.id)
    let pedido = await PedidoProveedor.findByPk(req.body.id, {
        attributes: [
            "id",
            "recibido" //agregar a modelo
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
    
    //console.log(pedido.toJSON())

    if(!pedido.recibido){
        await Promise.all(
            pedido.Pedido.DetallePedidos.map(async (dp) => {
                    await Producto.increment('stock', 
                        { by: dp.cantidad, where: { id: dp.Producto.id } 
                    },
                  )
            })
        );

        //await Balance.increment("egresos", 
        //    { by: pedido.Pedido.total, where: { CicloId: pedido.Pedido.Ciclo.id } 
        //})
    }

    //let cicloActual = await Ciclo.findOne({
    //    attributes: [
    //      "id",
    //      "fechaInicio",
    //      "fechaFin",
    //      "numero",
    //      "actual",
    //      "estaEliminado",
    //    ],
    //    where: {
    //        actual: true
    //    }
    //});

    //if(cicloActual){
    //    //puntos
    //    cicloActual.save()
    //}

    pedido.recibido = true
    pedido.save()
    return res.status(200).json({ success: true, data: pedido });
})

exports.agregarPedidoProveedor = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    
    req.body.puntosTotales = 0
    const pedidoProv = await PedidoProveedor.create(req.body, {include: [
        {association: PedidoProveedor.Pedido, include: [
            {association: Pedido.DetallePedido,
                include: [{association: DetallePedido.Producto}]}
        ]}
    ]});

    console.log(  pedidoProv.Pedido.DetallePedidos[0].toJSON())

    let total_pedidopv = 0
    let total_ptos = 0
    await Promise.all(
        pedidoProv.Pedido.DetallePedidos.map(async dp => {
            if(dp.Producto){
                dp.subtotal = dp.cantidad * dp.Producto.precioCosto
                total_pedidopv += dp.subtotal
                total_ptos += dp.Producto.puntos
            } else {
                const producto = await Producto.findOne({
                    attributes: [
                        "precio",
                        "precioCosto",
                        "puntos"
                    ],
                    where: {
                        id: dp.ProductoId
                    }
                })

                dp.subtotal = dp.cantidad * producto.precioCosto
                total_ptos += producto.puntos
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
    
    console.log("ptossssssss", total_ptos)
    pedidoProv.puntosTotales = total_ptos
    await pedidoProv.save()
    
    
    res.status(200).json({ success: true, data:pedidoProv });
})


exports.getAllPedidoProveedor = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    let pedidosprov = await PedidoProveedor.findAll({
        attributes: [
            "id", 
            "recibido",
            "puntosTotales"
        ],
        include: [
            { model: Pedido, attributes: ["total", "fecha"],
                include: [{
                    model: DetallePedido, attributes: ["cantidad", "subtotal"],
                    include: [{
                      model: Producto, attributes: ["descripcion", "precio", "precioCosto", "codigo"]}]
                }, 
                {model: Ciclo, attributes: ["id", "numero"],}]
            }
        ],
    });
    

    return res.status(200).json({ success: true, data: pedidosprov });

})
