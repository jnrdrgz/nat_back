const express = require("express");
const router = express.Router();

const {
    agregarCiclo,
    getCicloActual,
    setCicloActual,
    getAllCiclos,
    editCiclo,
    diasParaTerminarCiclo,
    deleteCiclo
} = require("../controllers/ciclo");

router.route("/").get(getAllCiclos);
router.route("/agregar").post(agregarCiclo);
router.route("/actual").get(getCicloActual);
router.route("/setActual").put(setCicloActual);
router.route("/editar").put(editCiclo);
router.route("/eliminar").put(deleteCiclo);
router.route("/diasRestantes").get(diasParaTerminarCiclo)
module.exports = router;
