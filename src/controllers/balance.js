const {Op,QueryTypes} = require('sequelize')
const {
    Ciclo,
    Balance,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")

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
