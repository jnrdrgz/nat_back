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
    let cicloActual = await Ciclo.findOne({
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
    let cicloActual = await Ciclo.findOne({
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

    if(cicloActual){
        cicloActual.actual = false
        cicloActual.save()
    }
    
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


exports.editCiclo = asyncHandler(async (req, res, next) => {
    let cicloedit = await Ciclo.findByPk(req.body.id, {
        attributes: [
          "id",
          "fechaInicio",
          "fechaFin",
          "numero",
          "actual",
          "estaEliminado",
        ]
    });

    await cicloedit.update(req.body, {where: req.params})

    cicloedit.save()

    return res.status(200).json({ success: true, data: {cicloedit} });
})

exports.diasParaTerminarCiclo = asyncHandler(async (req, res, next) => {
    let cicloAct = await Ciclo.findOne({
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

    let fechaActual = new Date().getTime()

    let fechaCambiar = cicloAct.fechaFin.getTime()

    //let fechaMiliseg = ((fechaActual - fechaCambiar) / (1000 * 3600 * 24))

    let fechaMiliseg = fechaActual - fechaCambiar

    let fechaDias = (fechaMiliseg/86400000)

    return res.status(200).json({ success: true, data: {"dias": fechaDias} });
})
