const express = require("express");
const router = express.Router();

const{
    agregarPedidoProveedor,
    getAllPedidoProveedor,
    marcarPedidoProveedorRecibido
  } = require("../controllers/pedidoProveedor");

router.route("/agregar").post(agregarPedidoProveedor);
router.route("/recibido").put(marcarPedidoProveedorRecibido);
router.route("/").get(getAllPedidoProveedor);

module.exports = router;
