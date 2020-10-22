const {Op,QueryTypes} = require('sequelize')
const {
    Ciclo,
    Balance,
    sequelize
} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler");

exports.agregarCiclo = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    //SI O SI UN BALANCE POR CICLO
    const balance_ciclo = await Balance.create(req.body, {include: 
        {association: Balance.Ciclo}})
    
    await balance_ciclo.save()
    
    res.status(200).json({ success: true, data: balance_ciclo });
})
