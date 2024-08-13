const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth");

router.get("/google", authControllers.googleAuth);
router.get("/google/callback", authControllers.googleAuthCallback);

module.exports = router;
