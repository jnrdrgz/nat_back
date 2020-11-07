const express = require("express");
const router = express.Router();

const {
    agregarCiclo,
    getCicloActual,
    setCicloActual,
    getAllCiclos,
    editCiclo,
    diasParaTerminarCiclo
} = require("../controllers/ciclo");

router.route("/").get(getAllCiclos);
router.route("/agregar").post(agregarCiclo);
router.route("/actual").get(getCicloActual);
router.route("/setActual").put(setCicloActual);
router.route("/editar").put(editCiclo);
router.route("/diasRestantes").get(diasParaTerminarCiclo)
module.exports = router;
