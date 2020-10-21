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


exports.getAllCiclos = asyncHandler(async (req, res, next) => {
    let ciclos = await Ciclo.findAll({
        attributes: [
          "id",
          "fechaInicio",
          "fechaFin",
          "numero",
          "actual",
          "estaEliminado",
        ],
        where: {
            estaEliminado: false
        }
    });

    return res.status(200).json({ success: true, data: ciclos });
})



exports.getCicloActual = asyncHandler(async (req, res, next) => {
    let cicloActual = await Ciclo.findAll({
        attributes: [
          "id",
          "fechaInicio",
          "fechaFin",
          "numero",
          "actual",
          "estaEliminado",
        ],
        where: {
            actual: true
        }
    });

    return res.status(200).json({ success: true, data: cicloActual });
})



exports.setCicloActual = asyncHandler(async (req, res, next) => {
    let getActual = await Ciclo.findAll({
        attributes: [
          "id",
          "fechaInicio",
          "fechaFin",
          "numero",
          "actual",
          "estaEliminado",
        ],
        where: {
            actual: true
        }
    });

    getActual.actual = false
    getActual.save()



    const setActual = await Ciclo.findByPk(req.body.id, {
         attributes: [
           "id",
           "fechaInicio",
           "fechaFin",
           "numero",
           "actual",
           "estaEliminado",
         ]
     });

     setActual.actual = true
     setActual.save()

     res.status(200).json({ success: true, data:{} });

})
