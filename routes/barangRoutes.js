const express = require("express");
const router = express.Router();
const barangControl = require("../controller/barang");
const { check, body } = require("express-validator");

router.post("/tambah-barang", barangControl.tambahBarang);

module.exports = router;
