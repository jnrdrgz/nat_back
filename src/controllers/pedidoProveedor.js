const {Op,QueryTypes} = require('sequelize')
const {
    Pedido,
    DetallePedido,
    Producto,
    PedidoProveedor,
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
                }] 
            }
        ],
    });
    
    //if pedido not recibido
    await Promise.all(
        pedido.Pedido.DetallePedidos.map(async (dp) => {
                await Producto.increment('stock', 
                    { by: dp.cantidad, where: { id: dp.Producto.id } 
                },
              )
        })
    );
    
    // agregar a modelo
    //pedido.estaEliminado = true
    //pedido.save()
    return res.status(200).json({ success: true, data: {} });
})

exports.agregarPedidoProveedor = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedidoProv = await PedidoProveedor.create(req.body, {include: [
        {association: PedidoProveedor.Pedido, include: [
            {association: Pedido.DetallePedido,
                include: [{association: DetallePedido.Producto}]}
        ]}
    ]});

    
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
