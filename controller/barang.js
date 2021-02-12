const Barang = require("../model/barangModel");
const BarangEks = require("../model/barangEksternalModel");

exports.tambahBarang = (req, res, next) => {
  let { nama } = req.body;
  let { kondisi } = req.body;
  let { status } = req.body;
  let { lokasi } = req.body;
  let { milik } = req.body;
  let tanggal_masuk = new Date();
  let { jumlah } = req.body;
  let { satuan } = req.body;

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
  };

  if (milik === "internal") {
    let barang = new Barang(newBarang);
    let result = null;
    (async () => {
      result = await tambahBarang(barang);
      res.status(200).json(result);
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
