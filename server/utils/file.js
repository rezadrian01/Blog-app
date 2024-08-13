const fs = require("node:fs/promises");
const path = require("path");

exports.deleteFile = async (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  try {
    const result = await fs.unlink(filePath);
  } catch (err) {
    console.log(err);
  }
};
