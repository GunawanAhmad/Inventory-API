const fs = require("fs");

const deleteFile = (filepath) => {
  if (fs.existsSync(filepath)) {
    fs.unlink(filepath, (err) => {});
  }
};

exports.deleteFile = deleteFile;
