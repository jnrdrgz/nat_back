const express = require("express");
const router = express.Router();

const {
    editarProducto,
    agregarProducto,
    getProductos,
    eliminarProducto,
    seleccionarproductoid,
} = require("../controllers/producto");

router.route("/").get(getProductos);
router.route("/agregar").post(agregarProducto);
router.route("/editar/:id").put(editarProducto);
router.route("/eliminar").put(eliminarProducto);
router.route("/:id").get(seleccionarproductoid);

module.exports = router;
