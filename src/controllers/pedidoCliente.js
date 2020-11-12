const {Op,QueryTypes, useInflection} = require('sequelize')
const {
    Pedido,
    Cliente,
    DetallePedido,
    PedidoCliente,
    Producto,
    Ciclo,
    Cuota,
    Balance,
    sequelize
} = require('../sequelize')

const asyncHandler = require("../middlewares/asyncHandler")

exports.getCodes = asyncHandler(async (req, res, next) => {
let all_codigos = await Producto.findAll({attributes: ["codigo"]})
    all_codigos = all_codigos.map(c => parseInt(c.codigo))
    console.log(all_codigos)

    res.status(200).json({ success: true, data:{codigos: all_codigos} });

})

exports.agregarPedidoCliente = asyncHandler(async (req, res, next) => {
    req.body.Pedido.DetallePedidos.map(dp => {
        console.log(dp)
    })

    const pedido = await PedidoCliente.build(req.body, {include: [
        {association: PedidoCliente.Cliente},
        {association: PedidoCliente.Pedido, include: [
            {association: Pedido.DetallePedido,
                include: [{association: DetallePedido.Producto}]
            }, 
                {association: Pedido.Ciclo}
        ]}
    ]});

    let all_codigos = await Producto.findAll({attributes: ["codigo"]})
    all_codigos = all_codigos.map(c => parseInt(c.codigo))
    console.log(all_codigos)

    let ret_f = false
                    
    if(!req.body.actualizarProductos){
        pedido.Pedido.DetallePedidos.map(dp => {
            if(dp.Producto){
                if(all_codigos.includes(parseInt(dp.Producto.codigo))){
                    res.status(300).json({ success: false, data:{} });
                    ret_f = true
                    return;
                }
            }
        })
    }

    if(ret_f) return;

    let total_pedido = 0
    await Promise.all(
        pedido.Pedido.DetallePedidos.map(async dp => {
            //console.log("DP::::::", dp)

            if(dp.Producto){
                if(all_codigos.includes(parseInt(dp.Producto.codigo))){
                
                    const producto = await Producto.findOne({
                        attributes: [
                            "id",
                            "precio",
                            "precioCosto",
                            "stock",
                            "puntos"
                        ],
                        where: {
                            codigo: dp.Producto.codigo
                        }
                    })

                    if(producto){
                        producto.stock += dp.Producto.stock
                        producto.puntos = dp.Producto.puntos
                        producto.precio = dp.Producto.precio
                        producto.precioCosto = dp.Producto.precioCosto
                        await producto.save()
                        
                        console.log("DP::::::", dp.Producto)
                        //dp.Producto.Id = producto.id
                        dp.setDataValue("Producto", producto)
                    }
                }

                dp.subtotal = dp.cantidad * dp.Producto.precio
                total_pedido += dp.subtotal
                dp.precioUnitario = dp.Producto.precio
                //await dp.save()  
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
                dp.precioUnitario = producto.precio
                //await dp.save()
                total_pedido += dp.subtotal
            }
        })
    )


    pedido.Pedido.total = total_pedido
    //await pedido.Pedido.save()

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
            { model: Cuota, attributes: ["fecha", "monto"]},
            { model: Cliente, attributes: ["nombre", "numeroTelefono"] },
            { model: Pedido, attributes: ["total", "fecha"],
            include: [{
                    model: DetallePedido, attributes: ["cantidad", "subtotal", "precioUnitario"],
                    include: [{model: Producto, attributes: ["id", "descripcion", "precio", "precioCosto"]}]
                }]
            }
        ],
        order: [
            [{model: Pedido}, "fecha", 'DESC'],
        ],
       
        
    });

    if(req.query.onlyDeudores){
        console.log("Only Deudores")
        //pedidos.filter()
        pedidos = pedidos.filter((p) =>{
            return !p.pagado
        })
    }

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
        pedidoCl.montoSaldado = pedidoCl.Pedido.total
        //ponerle un if
        //await Balance.increment("ingresos", 
        //    { by: pedidoCl.Pedido.total, where: { CicloId: pedidoCl.Pedido.Ciclo.id } 
        //})
    }

    pedidoCl.pagado = true
    await pedidoCl.save()

    res.status(200).json({ success: true, data:pedidoCl});
})

exports.pedidoPorWp = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    let pedido_str = req.body.pedido

    let unidades = [...pedido_str.matchAll(/\*[0-9]*\*/g)].map(u => u[0])
    let codigos = [...pedido_str.matchAll(/\*Código: [0-9]*\*/g)].map(c => c[0])
    let precios_productos = 
        [...pedido_str.matchAll(/\$ [0-9]+.?[0-9]+\,[0-9]+ +.+\n+/g)].map(pp => pp[0].replace(".",""))

        console.log(precios_productos)
    let precios = precios_productos.map(p => {
        return p.replace(/[a-zA-Z]|\$/g, "").trim()
    })

    let productos = precios_productos.map(p => {
        return p.replace(/[0-9]|\.|,|\$/g, "").trim()
    })
    console.log("unidades ", unidades)
    console.log("codigos ", codigos)
    console.log("precios/prods", precios_productos)
      
    unidades = unidades.map(u => u.split("*").join(""))
    codigos = codigos.map(c => c.replace("Código: ", "").split("*").join(""))
    console.log("unidades ", unidades)
    console.log("codigos ", codigos)
    console.log("precios ", precios)
    console.log("productos ", productos)
    console.log("------------------------------------")

    const pedido_body =  {
        recibido: true,
        Pedido:{
            total: 0.0,
            DetallePedidos: [
                
            ]
        }
    }

    let productos_list = []
    for(var i = 0; i < unidades.length; i++){
        productos_list.push(
            {
                descripcion: productos[i],
                codigo: parseInt(codigos[i]),
                puntos: 0.0,
                precio: parseFloat(precios[i])/parseInt(unidades[i]),
                stock: 0.0,
                cantidad: unidades[i]
            }
        )
    }
    
    
    //return para subirlo en front y de ahi carga manual
    res.status(200).json({ success: true, data: {productos:productos_list}} );


//    const pedido = await PedidoCliente.create(pedido_body, {include: [
//        {association: PedidoCliente.Cliente},
//        {association: PedidoCliente.Pedido, include: [
//            {association: Pedido.DetallePedido,
//                include: [{association: DetallePedido.Producto}]}, 
//                {association: Pedido.Ciclo}
//        ]}
//    ]});
//
//    pedido.save()
//    
//    res.status(200).json({ success: true, data: unidades });

})

exports.cancelarPedido = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedido = await PedidoCliente.findByPk(req.body.id, {
        attributes: [
            "id",
            "montoSaldado",
            "entregado",
            "pagado"
        ], include: [
            { model: Pedido, attributes: ["total", "cancelado"], }
        ],
    });


    pedido.Pedido.cancelado = true
    pedido.Pedido.save()

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
            { model: Pedido, attributes: ["total"], 
                include: [{ 
                    model: DetallePedido, attributes: ["cantidad", "subtotal"],
                    include: [{model: Producto, attributes: ["id", "descripcion", "precio", "precioCosto"]}] 
                }, {model: Ciclo, attributes: ["id"],}] 
            }
        ],
        where: {
            pagado: false,
            entregado: true
        }
    });

    return res.status(200).json({ success: true, data: pedidos });
})

exports.pagarCuotaPedido = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const pedido = await PedidoCliente.findByPk(req.body.pedidoId, {
        attributes: [
            "id",
            "montoSaldado",
            "entregado",
            "pagado"
        ]
    });

    const cuota = await Cuota.create({
        monto:req.body.monto,
        PedidoClienteId: pedido.id
    })
    cuota.save()
    
    pedido.montoSaldado += parseFloat(req.body.monto)
    if(pedido.montoSaldado <= 0){
        pedido.pagado = true;
    }
    pedido.save()


    res.status(200).json({ success: true, data: pedido });
})