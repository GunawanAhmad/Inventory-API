const Barang = require("../model/barangModel");
const BarangEks = require("../model/barangEksternalModel");
const fileHelper = require("../util/file");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const gDriveHandler = require("../util/gDriveHandler.js");

exports.tambahBarang = (req, res, next) => {
  let { nama } = req.body;
  let { kondisi } = req.body;
  let status = "Ada";
  let { lokasi } = req.body;
  let milik = req.body.milik.toLowerCase();
  let tanggal_masuk = new Date();
  let { jumlah } = req.body;
  let { satuan } = req.body;
  let photo = req.imgLink;
  let file = null;
  if (req.file) {
    file = req.file.path.replace("\\", "/");
  }

  let eksProp = null;
  if (milik === "eksternal") {
    let { nama_pemilik } = req.body;
    let tanggal_dipinjam = new Date();
    let tanggal_dikembalikan = null;
    let status_peminjaman = "Dipinjam";

    eksProp = {
      nama_pemilik,
      tanggal_dipinjam,
      tanggal_dikembalikan,
      status_peminjaman,
    };
  }

  let newBarang = {
    nama,
    kondisi,
    status,
    lokasi,
    milik,
    tanggal_masuk,
    jumlah,
    satuan,
    photo,
  };

  if (milik === "internal") {
    let barang = new Barang(newBarang);
    let result = null;
    (async () => {
      result = await tambahBarang(barang);
      fileHelper.deleteFile(file);
      try {
        res.status(200).json(result);
      } catch (err) {
        throw new Error("penambahan barang gagal");
      }
    })();
  } else if (milik === "eksternal") {
    let eksBarang = {
      ...newBarang,
      ...eksProp,
    };
    let barang = new BarangEks(eksBarang);
    (async () => {
      result = await tambahBarang(barang);
      res.status(200).json(result);
    })();
  }
};

async function tambahBarang(barang) {
  try {
    const result = await barang.save();
    return result;
  } catch (err) {
    throw new Error("penambahan barang gagal");
  }
}

exports.hapusBarang = (req, res, next) => {
  const { barangId } = req.body;
  const { milik } = req.body;
  if (milik.toLowerCase() === "internal") {
    Barang.findByIdAndDelete(barangId)
      .then((result) => {
        if (!result) {
          throw new Error("barang tidak ditemukan");
        }

        gDriveHandler.deleteFileFromGdrive(result.photo);

        console.log("Hapus barang sukses");
        res.status(200).json({ message: "Delete Sukses", data: result });
      })
      .catch((err) => {
        console.log(err);
        return next(err);
      });
  } else if (milik.toLowerCase() === "eksternal") {
    BarangEks.findByIdAndDelete(barangId)
      .then((result) => {
        if (!result) {
          throw new Error("barang tidak ditemukan");
        }
        gDriveHandler.deleteFileFromGdrive(result.photo);

        console.log("Hapus barang sukses");
        res.status(200).json({ message: "Delete Sukses", data: result });
      })
      .catch((err) => {
        console.log(err);
        return next(err);
      });
  } else {
    throw new Error("milik barang tidak diketahui");
  }
};

exports.editBarang = (req, res, next) => {
  const { barangId } = req.body;
  Barang.findById(barangId)
    .then((barang) => {
      if (!barang) {
        throw Error("Barang tidak ditemukan");
      }
      barang.nama = req.body.nama;
      barang.lokasi = req.body.lokasi;
      barang.jumlah = req.body.jumlah;
      barang.satuan = req.body.satuan;
      barang.kondisi = req.body.kondisi;
      if (req.file) {
        if (barang.photo) {
          fileHelper.deleteFile(barang.photo);
        }
        barang.photo = req.file.path.replace("\\", "/");
      }
      if (
        req.body.status.toLowerCase() == "dipinjam" &&
        barang.status.toLowerCase() != "dipinjam"
      ) {
        barang.status = req.body.status;
        barang.nama_peminjam = req.body.nama_peminjam;
        barang.tanggal_peminjaman = new Date();
        //add to history peminjaman
      } else {
        barang.status = req.body.status;
        barang.nama_peminjam = "";
        barang.tanggal_peminjaman = "";
      }

      return barang.save();
    })
    .then((barang) => {
      res.status(200).json({ message: "sukses", barang: barang });
    })

    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

exports.cariSemuabarangInt = (req, res, next) => {
  Barang.find()
    .then((result) => {
      if (!result) {
        throw new Error("Query barang gagal");
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

exports.cariSemuabarangEks = (req, res, next) => {
  BarangEks.find()
    .then((result) => {
      if (!result) {
        throw new Error("Query barang gagal");
      }
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

exports.detailBarang = (req, res, next) => {
  const { barangId } = req.query;
  const { milik } = req.query;
  if (barangId.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    if (milik.toLowerCase() === "internal") {
      Barang.findById(barangId)
        .then((result) => {
          if (!result) {
            const err = new Error("Barang tidak ditemukan");
            err.statusCode = 404;
            throw err;
          } else {
            res.status(200).json(result);
          }
        })
        .catch((err) => {
          console.log(err);
          return next(err);
        });
    } else if (milik.toLowerCase() === "eksternal") {
      BarangEks.findById(barangId)
        .then((result) => {
          if (!result) {
            throw new Error("Barang tidak ditemukan");
          }
          console.log(result);
          res.status(200).json(result);
        })
        .catch((err) => {
          console.log(err);
          return next(err);
        });
    } else {
      throw new Error("query barang gagal");
    }
  } else {
    throw new Error("ID Tidak Valid");
  }
};

exports.downloadCSV = (req, res, next) => {
  let milik = req.params.milik.toLowerCase();
  if (milik == "internal") {
    Barang.find({})
      .then((data) => {
        let hasil_csv = [];
        data.forEach((barang) => {
          hasil_csv.push({
            nama_barang: barang.nama,
            status: barang.status,
            kondisi: barang.kondisi,
            tanggal_masuk: barang.tanggal_masuk,
            lokasi: barang.lokasi,
            milik: barang.milik,
            jumlah: barang.jumlah + " " + barang.satuan,
            nama_peminjam: barang.nama_peminjam,
            tanggal_peminjaman: barang.tanggal_peminjaman,
          });
        });
        const csvFields = [];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csv = json2csvParser.parse(hasil_csv);

        fs.writeFile("barang.csv", csv, function (err) {
          if (err) throw err;
          res.download("barang.csv", "barang.csv");
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else if (milik == "eksternal") {
    BarangEks.find({})
      .then((data) => {
        let hasil_csv = [];
        data.forEach((barang) => {
          hasil_csv.push({
            nama_barang: barang.nama,
            status: barang.status,
            kondisi: barang.kondisi,
            lokasi: barang.lokasi,
            milik: barang.milik,
            jumlah: barang.jumlah + " " + barang.satuan,
            nama_pemilik: barang.nama_pemilik,
            tanggal_dipinjam: barang.tanggal_dipinjam,
          });
        });
        const csvFields = [];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csv = json2csvParser.parse(hasil_csv);

        fs.writeFile("barang.csv", csv, function (err) {
          if (err) throw err;
          res.download("barang.csv", "barang.csv");
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else {
    throw new Error("milik tidak valid");
  }
};
