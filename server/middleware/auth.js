const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

exports.isAuth = async (req, res, next) => {
  try {
    const header = req.get("Authorization")?.split(" ")[1] || null;
    if (!header) throw new Error();
    const decodedToken = jwt.verify(header, process.env.JWT_SECRET_KEY);
    if (!decodedToken) throw new Error();
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    req.isAuth = false;
    req.userId = null;
    return next();
  }
};
