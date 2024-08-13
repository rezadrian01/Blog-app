const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const fs = require("fs").promises;
const path = require("path");

config();

const app = express();
const uri = process.env.MONGODB_URI;

//routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

//middleware
const { isAuth } = require("./middleware/auth");

const fileStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let folder = "images";
    if (req.body.folderName) {
      const safeFolderName = path
        .normalize(req.body.folderName)
        .replace(/^(\.\.(\/|\\|$))+/, "");
      folder = `images/${safeFolderName}`;
    }
    await fs.mkdir(path.join(__dirname, folder), { recursive: true });
    cb(null, folder);
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

app.use(isAuth);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

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
