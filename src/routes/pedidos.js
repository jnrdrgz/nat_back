const express = require("express");
const router = express.Router();

const {
    agregarPedidoCliente,
    getAllPedidoCliente,
    pedidoEntregado
} = require("../controllers/pedido");

const{
    agregarPedidoProveedor,
    getAllPedidoProveedor,
    marcarPedidoProveedorRecibido
  } = require("../controllers/pedidoProveedor");

router.route("/cliente/agregar").post(agregarPedidoCliente);
router.route("/cliente").get(getAllPedidoCliente);
router.route("/proveedor/agregar").post(agregarPedidoProveedor);
router.route("/proveedor/marcar_recibido").put(marcarPedidoProveedorRecibido);
router.route("/proveedor").get(getAllPedidoProveedor);
router.route("/entregado").put(pedidoEntregado);

module.exports = router;
