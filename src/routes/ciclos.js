const express = require("express");
const router = express.Router();

const {
    agregarCiclo,
    getCicloActual,
    setCicloActual,
    getAllCiclos
} = require("../controllers/ciclo");

router.route("/").get(getAllCiclos);
router.route("/agregar").post(agregarCiclo);
router.route("/actual").get(getCicloActual);
router.route("/setActual").put(setCicloActual);



module.exports = router;
