const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const barangSchema = new Schema({
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
  tanggal_masuk: {
    type: Date,
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

module.exports = mongoose.model("Barang", barangSchema);
