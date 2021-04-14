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
  status_peminjaman: {
    type: String,
  },
  jumlah: {
    type: Number,
    required: true,
  },
  satuan: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BarangEksternals", barangEksternalSchema);
