const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/post");
const { body } = require("express-validator");

router.post("/post", postControllers.createPost);
router.get("/posts", postControllers.fetchPosts);
router.get("/post/:postId", postControllers.createPost);

module.exports = router;
