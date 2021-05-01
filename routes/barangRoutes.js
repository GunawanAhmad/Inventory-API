const errorHandler = require("../util/errorHandler");
const express = require("express");
const router = express.Router();
const barangControl = require("../controller/barang");
const multer = require("multer");
const authMiddle = require("../middleware/authMiddle");

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
  authMiddle.accesCheck,
  uploadPhoto.single("photo"),
  errorHandler.tambahBarangErrorHandler,
  barangControl.tambahBarang
);
router.delete(
  "/hapus-barang",
  authMiddle.accesCheck,
  barangControl.hapusBarang
);
router.post(
  "/edit-barang",
  uploadPhoto.single("photo"),
  authMiddle.accesCheck,
  errorHandler.editBarangErrorHandler,
  barangControl.editBarang
);
router.get(
  "/list-barang-internal",
  authMiddle.accesCheck,
  barangControl.cariSemuabarangInt
);
authMiddle.accesCheck,
  router.get(
    "/list-barang-eksternal",
    authMiddle.accesCheck,
    barangControl.cariSemuabarangEks
  );
router.get("/barang", authMiddle.accesCheck, barangControl.detailBarang);

module.exports = router;
