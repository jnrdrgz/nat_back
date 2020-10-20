const {Op,QueryTypes} = require('sequelize')
const {
    Ciclo,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler");

exports.agregarCiclo = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const ciclo = await Ciclo.create(req.body);
    await ciclo.save()
    
    res.status(200).json({ success: true, data: ciclo });
})
