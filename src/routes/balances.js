const express = require("express");
const router = express.Router();

const {
    getBalanceCiclo,
} = require("../controllers/balance");

//router.route("/").get(getCiclos);
//router.route("/ciclo").get(getBalanceCiclo);
router.route("/ciclo/:id").get(getBalanceCiclo);

module.exports = router;
