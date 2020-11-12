const express = require("express");
const router = express.Router();

const {
    getAllCuotas
} = require("../controllers/cuotas");

router.route("/").get(getAllCuotas);

module.exports = router;
