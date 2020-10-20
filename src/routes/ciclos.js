const express = require("express");
const router = express.Router();

const {
    agregarCiclo
} = require("../controllers/ciclo");

//router.route("/").get(getCiclos);
router.route("/agregar").post(agregarCiclo);


module.exports = router;


