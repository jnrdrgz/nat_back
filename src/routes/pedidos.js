const express = require("express");
const router = express.Router();

const {
    eliminarPedido,
    getPedidosAdeudados,
} = require("../controllers/pedidos");

router.route("/eliminar").put(eliminarPedido);
router.route("/traerPedidosAdeudados").get(getPedidosAdeudados);

module.exports = router;