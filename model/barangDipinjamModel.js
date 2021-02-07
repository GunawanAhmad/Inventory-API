const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const barangDipinjamSchema = new Schema({
  barangId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  nama_peminjam : {
      type : String,
      required : true,   
  },
  tanggal_dipinjam : {
      type : Date,
      required : true,
  }
  tanggal_dikembalikan : {
      type : Date
  },
  foto_bukti : {
      type : String
  },
  status_peminjaman : {
      type : String,
  }
});

module.exports = mongoose.model("BarangDipinjam", barangDipinjamSchema);
