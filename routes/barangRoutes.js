const express = require("express");
const router = express.Router();
const barangControl = require("../controller/barang");
const { check, body } = require("express-validator");

router.post("/tambah-barang", barangControl.tambahBarang);
router.delete("/hapus-barang", barangControl.hapusBarang);
router.put("/edit-barang", barangControl.editBarang);
router.get("/list-barang-internal", barangControl.cariSemuabarangInt);
router.get("/list-barang-eksternal", barangControl.cariSemuabarangEks);
router.get("/barang", barangControl.detailBarang);

module.exports = router;
