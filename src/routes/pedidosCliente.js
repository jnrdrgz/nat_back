const express = require("express");
const router = express.Router();

const {
    agregarPedidoCliente,
    getAllPedidoCliente,
    marcarPedidoEntregado,
    marcarPedidoPagado
} = require("../controllers/pedidoCliente");

router.route("/").get(getAllPedidoCliente);
router.route("/agregar").post(agregarPedidoCliente);
router.route("/entregado").put(marcarPedidoEntregado);
router.route("/pagado").put(marcarPedidoPagado);

module.exports = router;