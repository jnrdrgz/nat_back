const {Op,QueryTypes} = require('sequelize')
const {
    Cuota,
    Balance,
    PedidoCliente,
    Cliente,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")


exports.getAllCuotas = asyncHandler(async (req, res, next) => {
    console.log(req.params)

    let cuotas = await Cuota.findAll({
        attributes: [
            "id",
            "fecha",
            "monto"
        ],
        include: [
            { model: PedidoCliente, attributes: ["id", "montoSaldado"],
            include: [
                { model: Cliente, attributes: ["nombre", "numeroTelefono"] }
            ]}
        ]
    });

    return res.status(200).json({ success: true, data: cuotas });
})
