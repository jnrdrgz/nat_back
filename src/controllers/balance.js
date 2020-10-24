const {Op,QueryTypes} = require('sequelize')
const {
    Ciclo,
    Balance,
    PedidoCliente,
    PedidoProveedor,
    Pedido,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")

exports.test = (req, res, next) => Promise.resolve((async (req, res, next) => {
    console.log(req.query.test)
    res.status(200).json({ success: true, data: req.query.test });
})(req,res,next).catch(next))

exports.getBalanceCiclo = asyncHandler(async (req, res, next) => {
    console.log(req.params)

    let balance = await Balance.findOne({
        attributes: [
            "id",
            "ingresos",
            "egresos",
        ],
        where: {
            cicloId: req.params.id
        }
    });

    return res.status(200).json({ success: true, data: balance });
})

exports.getBalanceMes  = asyncHandler(async (req, res, next) => {
    
    let pedidosprov = await PedidoProveedor.findAll({
        attributes: [
            "id", 
            "recibido",
        ],
        include: [
            { model: Pedido, attributes: ["total", "fecha"] }
        ],
    });
    
    let pedidos = await PedidoCliente.findAll({
        attributes: [
            "id",
            "pagado"
        ],
        include: [
            { model: Pedido, attributes: ["total", "fecha"] }
        ],
    });

    let _balance = {
        ingresos: 0.0,
        egresos: 0.0
    }

    pedidos.map(p => {
        //mes +1 porque el retraso este empieza de 0
        
        if(p.pagado && p.Pedido.fecha.getMonth()+1 == req.params.mes){
            _balance.ingresos += p.Pedido.total
        }
    })

    pedidosprov.map(p => {
        //console.log(p.Pedido.fecha.getMonth())
        if(p.pagado && p.Pedido.fecha.getMonth()+1 == req.params.mes){
            _balance.egresos += p.Pedido.total
        }
    })

    return res.status(200).json({ success: true, data: _balance });
})

exports.getBalanceIntervalo = asyncHandler(async (req, res, next) => {
    //http://localhost:3001/balances/intervalo?d=20-10-2020&h=21-10-2020
    console.log(req.query.d)
    console.log(req.query.h)
    console.log(req.query.d.split("-"))
    const desde = new Date(req.query.d.split("-"))
    const hasta = new Date(req.query.h.split("-"))
    
    console.log(desde)
    console.log(hasta)

    let ingresos_pcliente = await PedidoCliente.sum("total", {
        where: {
            pagado: true
        },
        include: [
            { 
                model: Pedido, 
                attributes: ["total", "fecha"],
                where: {
                    fecha: {
                        [Op.gte]: desde,
                        [Op.lte]: hasta,
                    }      
                }}
        ]
    })

    let egresos_proveedor = await PedidoProveedor.sum("total", {
        where: {
            recibido: true
        },
        include: [
            { 
                model: Pedido, 
                attributes: ["total", "fecha"],
                where: {
                    fecha: {
                        [Op.gte]: desde,
                        [Op.lte]: hasta,
                    }      
                }}
        ]
    })


    let _balance = {
        ingresos: ingresos_pcliente,
        egresos: egresos_proveedor
    }

    //let pedidos = await PedidoCliente.findAll({
    //    attributes: [
    //        "id",
    //        "pagado"
    //    ],
    //    where: {
    //        pagado: true
    //    },
    //    include: [
    //        { 
    //            model: Pedido, 
    //            attributes: ["total", "fecha"],
    //            where: {
    //                fecha: {
    //                    [Op.gte]: desde,
    //                    [Op.lte]: hasta,
    //                }      
    //            }}
    //    ],
    //    
    //});

  

    
    return res.status(200).json({ success: true, data: _balance });

})
    

