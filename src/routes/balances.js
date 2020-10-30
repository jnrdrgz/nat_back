const express = require("express");
const router = express.Router();

const {
    getBalanceCiclo,
    getBalanceMes, 
    test,
    getBalanceIntervalo
} = require("../controllers/balance");

//router.route("/").get(getCiclos);
//router.route("/ciclo").get(getBalanceCiclo);
router.route("/ciclo/:id").get(getBalanceCiclo);
router.route("/mes/:mes").get(getBalanceMes);
router.route("/test").get(test);
router.route("/intervalo").get(getBalanceIntervalo);


module.exports = router;
