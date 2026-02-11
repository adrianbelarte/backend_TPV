// utils/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, dir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    const name = `logo_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });
module.exports = upload;
