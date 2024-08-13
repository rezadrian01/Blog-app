const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router.get("/google", authControllers.googleAuth);
router.get("/google/callback", authControllers.googleAuthCallback);
router.post("/signup", authControllers.signup);
router.post("/signin", authControllers.signin);

module.exports = router;
