const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/post");
const { body } = require("express-validator");

router.post("/post", postControllers.createPost);
router.get("/posts", postControllers.fetchPosts);
router.get("/post/:postId", postControllers.createPost);
router.put("/post/:postId", postControllers.updatePost);
router.delete("/post/:postId", postControllers.deletePost);

router.post("/post/like/:postId", postControllers.addLikePost);
router.post("/post/removeLike/:postId", postControllers.removeLikePost);

router.post("/post/comment/like/:commentId", postControllers.likeComment);
router.post(
  "/post/comment/removeLike/:commentId",
  postControllers.removeLikeComment
);

router.post("/post/comment/:postId", postControllers.createComment);
router.put("/post/comment/:postId", postControllers.editComment);
router.delete("/post/comment/:postId", postControllers.deleteComment);

module.exports = router;
