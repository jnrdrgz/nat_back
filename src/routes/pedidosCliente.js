const express = require("express");
const router = express.Router();

const {
    agregarPedidoCliente,
    getAllPedidoCliente,
    marcarPedidoEntregado,
    marcarPedidoPagado,
    pedidoPorWp,
    cancelarPedido,
    getPedidosAdeudados,
    pagarCuotaPedido
} = require("../controllers/pedidoCliente");

router.route("/").get(getAllPedidoCliente);
router.route("/agregar/porwp").post(pedidoPorWp);
router.route("/agregar").post(agregarPedidoCliente);
router.route("/entregado").put(marcarPedidoEntregado);
router.route("/pagado").put(marcarPedidoPagado);
router.route("/cancelar").put(cancelarPedido);
router.route("/getAdeudados").get(getPedidosAdeudados);
router.route("/pagarCuota").put(pagarCuotaPedido);

module.exports = router;