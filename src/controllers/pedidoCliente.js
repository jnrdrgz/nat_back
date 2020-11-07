const {Op,QueryTypes} = require('sequelize')
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
                dp.precioUnitario = dp.Producto.precio
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
                dp.precioUnitario = producto.precio
                await dp.save()
                total_pedido += dp.subtotal
            }
        })
    )

    pedido.Pedido.total = total_pedido
    await pedido.Pedido.save()

    pedido.montoSaldado = total_pedido
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
            { model: Cliente, attributes: ["nombre"] },
            { model: Pedido, attributes: ["total", "fecha"],
            include: [{
                    model: DetallePedido, attributes: ["cantidad", "subtotal", "precioUnitario"],
                    include: [{model: Producto, attributes: ["id", "descripcion", "precio", "precioCosto"]}]
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
        [...pedido_str.matchAll(/\$ [0-9]+.[0-9]+\,[0-9]+ +[\w ]+/g)].map(pp => pp[0].replace(".",""))

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

    for(var i = 0; i < unidades.length; i++){
        pedido_body.Pedido.DetallePedidos.push({
            Producto:{
                descripcion: productos[i],
                codigo: parseInt(codigos[i]),
                puntos: 0.0,
                precio: parseFloat(precios[i])/parseInt(unidades[i]),
                stock: 0.0
            },
            cantidad: parseInt(unidades[i]),
            subtotal: parseFloat(precios[i])
        })
    }
    
    console.log(pedido_body.Pedido.DetallePedidos)

    const pedido = await PedidoCliente.create(pedido_body, {include: [
        {association: PedidoCliente.Cliente},
        {association: PedidoCliente.Pedido, include: [
            {association: Pedido.DetallePedido,
                include: [{association: DetallePedido.Producto}]}, 
                {association: Pedido.Ciclo}
        ]}
    ]});

    pedido.save()
    
    res.status(200).json({ success: true, data: unidades });

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
        pedidoId: pedido.id
    })
    cuota.save()
    
    pedido.montoSaldado -= req.body.monto
    pedido.save()


    res.status(200).json({ success: true, data: pedido });
})