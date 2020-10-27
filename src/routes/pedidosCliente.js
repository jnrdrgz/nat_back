const express = require("express");
const router = express.Router();

const {
    agregarPedidoCliente,
    getAllPedidoCliente,
    marcarPedidoEntregado,
    marcarPedidoPagado,
    pedidoPorWp
} = require("../controllers/pedidoCliente");

router.route("/").get(getAllPedidoCliente);
router.route("/agregar/porwp").post(pedidoPorWp);
router.route("/agregar").post(agregarPedidoCliente);
router.route("/entregado").put(marcarPedidoEntregado);
router.route("/pagado").put(marcarPedidoPagado);

module.exports = router;