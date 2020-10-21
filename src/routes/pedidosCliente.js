const express = require("express");
const router = express.Router();

const {
    agregarPedidoCliente,
    getAllPedidoCliente,
    marcarPedidoEntregado
} = require("../controllers/pedidoCliente");

router.route("/agregar").post(agregarPedidoCliente);
router.route("/").get(getAllPedidoCliente);
router.route("/entregado").put(marcarPedidoEntregado);

module.exports = router;