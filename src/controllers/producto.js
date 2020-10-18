const {Op} = require('sequelize')
const {Producto} = require('../sequelize')
const asyncHandler = require("../middlewares/asyncHandler")

exports.test = (req, res, next) =>
    Promise.resolve((async (req, res, next) => {
        res.status(200).json({ success: true, data: "Alive" });
    })(req,res,next).catch(next))

exports.agregarProducto = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const producto = await Producto.create(req.body);

    await producto.save();

    res.status(200).json({ success: true, data:producto });
})

exports.eliminarProducto = asyncHandler(async (req, res, next) => {
    console.log(req.body)

    const producto = await Producto.findByPk(req.body.id, {
        attributes: [
            "id",
            "descripcion",
            "codigo",
            "puntos",
            "precio",
            "stock",
            "foto",
            "estaEliminado",
        ]
    });

    producto.estaEliminado = true
    producto.save()

    res.status(200).json({ success: true, data:{} });
})

exports.getProductos = asyncHandler(async (req, res, next) => {
    let productos = await Producto.findAll({
        attributes: [
            "id",
            "descripcion",
            "codigo",
            "puntos",
            "precio",
            "stock",
            "foto",
            "estaEliminado",
        ],
        where: {
            estaEliminado: false
        }
    });

    //if (productos.length != 0)
    return res.status(200).json({ success: true, data: productos });

    //return res.status(404).json({ success: false, msg: "Till not created" })
})

exports.seleccionarproductoid = asyncHandler(async (req, res, next) => {
console.log(req.body)

const productoid = await Producto.findOne({where: req.params})
.then(result => {
    if (result) {
      res.json(result);
}
 else {
 res.sendStatus(404);
}
})
.catch(error => {
res.status(412).json({msg: error.message});
});

})



exports.editarProducto = asyncHandler(async (req, res, next) => {
    const productoedit = Producto.update(req.body, {where: req.params})

    return res.status(200).json({ success: true, data: {productoedit} });
})
