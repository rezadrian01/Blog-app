const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");

router.get("/profile/:userId", userControllers.showUserProfile);
router.get("/followers/:userId", userControllers.showFollowers);
router.get("/followed/:userId", userControllers.showFollowed);
router.get("/search/:searchTerm", userControllers.searchUser);

router.post("/updateBio", userControllers.updateBio);
router.post("/addFollowing/:userId", userControllers.addFollowing);
router.post("/removeFollowing/:userId", userControllers.removeFollowing);

module.exports = router;
