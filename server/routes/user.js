const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");

router.get("/profile/:username", userControllers.showUserProfile);
router.get("/followers/:username", userControllers.showFollowers);
router.get("/followed/:username", userControllers.showFollowed);
router.get("/search/:searchTerm", userControllers.searchUser);

router.post("/updateProfile", userControllers.updateUserProfile);
router.post("/addFollowing/:username", userControllers.addFollowing);
router.post("/removeFollowing/:username", userControllers.removeFollowing);

module.exports = router;
