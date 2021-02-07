const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const barangEksternalSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  kondisi: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  lokasi: {
    type: String,
  },
  milik: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
  },
  milik: {
    type: String,
    required: true,
  },
  nama_pemilik: {
    type: String,
    required: true,
  },
  tanggal_dipinjam: {
    type: Date,
  },
  tanggal_dikembalikan: {
    type: Date,
  },
  foot_bukti: {
    type: String,
  },
  status_peminjaman: {
    type: String,
  },
});

module.exports = mongoose.model("BarangDipinjam", barangEksternalSchema);
