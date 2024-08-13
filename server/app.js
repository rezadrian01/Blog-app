const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

config();

const app = express();
const uri = process.env.MONGODB_URI;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/:/g, "-");
    cb(null, `${date}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

app
  .use(bodyParser.json())
  .use(cors())
  .use(multer({ fileFilter, storage: fileStorage }).single("image"));

app.use((err, req, res, next) => {
  const message = err.message || "An error occurred!";
  const data = err.data || [];
  const status = err.statusCode || 500;
  const success = false;
  res.status(status).json({ message, data, success });
});

mongoose
  .connect(uri)
  .then((result) => {
    app.listen(process.env.SERVER_PORT, () =>
      console.log(`Server is running at ${process.env.SERVER_DOMAIN}`)
    );
  })
  .catch((err) => console.log(err));
