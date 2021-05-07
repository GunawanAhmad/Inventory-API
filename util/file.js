const fs = require("fs");

const deleteFile = (filepath) => {
  fs.unlink(filepath, (err) => {});
};

exports.deleteFile = deleteFile;
