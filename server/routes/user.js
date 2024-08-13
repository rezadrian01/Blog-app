const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");

router.post("/updateBio", userControllers.updateBio);
router.post("/addFollowing/:userId", userControllers.addFollowing);
router.post("/removeFollowing/:userId", userControllers.removeFollowing);

module.exports = router;
