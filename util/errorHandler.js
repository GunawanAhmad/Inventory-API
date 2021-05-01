exports.tambahBarangErrorHandler = (req, res, next) => {
  let { nama } = req.body;
  let { kondisi } = req.body;
  let { lokasi } = req.body;
  let milik = req.body.milik.toLowerCase();
  let { jumlah } = req.body;
  let { satuan } = req.body;

  if (!nama) {
    throw Error("Nama tidak boleh kosong");
  }
  if (!kondisi) {
    throw Error("Kondisi tidak boleh kosong");
  }
  if (!lokasi) {
    throw Error("Lokasi tidak boleh kosong");
  }
  if (jumlah < 1) {
    throw Error("Jumlah tidak boleh nol atau minus");
  }
  if (satuan.toLowerCase() != "pcs" && satuan.toLowerCase() != "pack") {
    throw Error("Satuan invalid");
  }
  if (milik != "internal" && milik != "eksternal") {
    throw Error("kepemilikan invalid");
  }
  next();
};

exports.editBarangErrorHandler = (req, res, next) => {
  let { nama } = req.body;
  let { kondisi } = req.body;
  let { lokasi } = req.body;
  let milik = req.body.milik.toLowerCase();
  let { jumlah } = req.body;
  let { satuan } = req.body;
  let status = req.body.status.toLowerCase();
  let { nama_peminjam } = req.body;

  if (!nama) {
    throw Error("Nama tidak boleh kosong");
  }
  if (!kondisi) {
    throw Error("Kondisi tidak boleh kosong");
  }
  if (!lokasi) {
    throw Error("Lokasi tidak boleh kosong");
  }
  if (jumlah < 1) {
    throw Error("Jumlah tidak boleh nol atau minus");
  }
  if (satuan.toLowerCase() != "pcs" && satuan.toLowerCase() != "pack") {
    throw Error("Satuan invalid");
  }
  if (milik != "internal" && milik != "eksternal") {
    throw Error("kepemilikan invalid");
  }

  if (status != "dipinjam" && status != "ada" && status != "hilang") {
    throw Error("status invalid");
  }

  if (status == "dipinjam") {
    if (!nama_peminjam) {
      throw Error("Nama peminjam tidak boleh kosong");
    }
  }
  next();
};
