const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { google } = require("googleapis");
const GDRIVE_CLIENT_ID = process.env.GDRIVE_CLIENT_ID;
const GDRIVE_CLIENT_SECRET = process.env.GDRIVE_CLIENT_SECRET;
const GDRIVE_REDIRECT_URI = process.env.GDRIVE_REDIRECT_URI;
const GDRIVE_REFRESH_TOKEN = process.env.GDRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  GDRIVE_CLIENT_ID,
  GDRIVE_CLIENT_SECRET,
  GDRIVE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: GDRIVE_REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

exports.uploadImgToGdrive = async (req, res, next) => {
  if (req.file) {
    let photo = req.file.path.replace("\\", "/");
    let filePath = path.join(__dirname, `../${photo}`);
    let fileMetadata = {
      name: req.file.filename,
      parents: ["1jk-Wz-gIr6K5q1RLliOSVStKDtudr_JS"],
    };
    let media = {
      mimeType: "image/jpg",
      body: fs.createReadStream(filePath),
    };
    if (fs.existsSync(filePath)) {
      drive.files
        .create({
          resource: fileMetadata,
          media: media,
          fields: "id",
        })
        .then((result) => {
          console.log("upload to gdrive succes");
        })
        .catch((err) => {
          throw Error("Failed to upload image");
        });
    }
  }

  next();
};
