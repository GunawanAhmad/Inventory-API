const errorHandler = require("../util/errorHandler");
const express = require("express");
const router = express.Router();
const barangControl = require("../controller/barang");
const multer = require("multer");

const filterImg = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const fileStoragePhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 100);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadPhoto = multer({
  storage: fileStoragePhoto,
  fileFilter: filterImg,
});

router.post(
  "/tambah-barang",
  uploadPhoto.single("photo"),
  errorHandler.tambahBarangErrorHandler,
  barangControl.tambahBarang
);
router.delete(
  "/hapus-barang",

  barangControl.hapusBarang
);
router.put("/edit-barang", barangControl.editBarang);
router.get("/list-barang-internal", barangControl.cariSemuabarangInt);
router.get("/list-barang-eksternal", barangControl.cariSemuabarangEks);
router.get("/barang", barangControl.detailBarang);

module.exports = router;
