const express = require("express");
const router = express.Router();

const {
    eliminarPedido,
} = require("../controllers/pedidos");

router.route("/eliminar").put(eliminarPedido);

module.exports = router;