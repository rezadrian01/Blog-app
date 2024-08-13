const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const { validationResult } = require("express-validator");
const { errTemp } = require("../utils/error");
const { deleteFile } = require("../utils/file");

const perPage = 5;

exports.createPost = async (req, res, next) => {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty) errTemp("Validation failed", 422, errors.array());
    if (!req.isAuth || !req.userId) errTemp("Not Authorized", 403);
    const user = await User.findById(req.userId);
    if (!user) errTemp("User not found", 404);

    const img = req.file.path.replace(/\\/g, "/");
    const content = req.body.content;
    const newPost = new Post({
      userId: user._id,
      img,
      content,
    });
    const createdPost = await newPost.save();
    user.posts.push(createdPost);
    await user.save();
    res
      .status(201)
      .json({ message: "Create post successfully", success: true });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchPosts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const posts = await Post.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    const postWithTotalComments = await Promise.all(
      posts.map(async (post) => {
        const totalComments = await Comment.find({
          postId: post._id,
        }).countDocuments();
        return { ...post._doc, totalComments };
      })
    );
    // const postsWithComments = await Promise.all(
    //   posts.map(async (post) => {
    //     const comments = await Comment.find({ postId: post._id }).populate(
    //       "userId",
    //       "name"
    //     );
    //     return { ...post._doc, comments };
    //   })
    // );
    res.status(200).json({
      success: true,
      message: "Success get posts",
      posts: postWithTotalComments,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.fetchPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)?.populate("likes", "name _id");
    if (!post) errTemp("Post not found", 404);
    const comments = await Comment.find({ postId }).populate(
      "userId",
      "name _id"
    );
    post.comments = comments;
    res
      .status(200)
      .json({ success: true, message: "Success get a post", post });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty) errTemp("Validation failed", 422, errors.array());
    if (!req.isAuth || !req.userId) errTemp("Not Authorized", 403);
    const user = await User.findById(req.userId);
    const post = await Post.findById(postId);
    if (!user || !post) errTemp("User or Post is not found", 404);

    const content = req.body.content || "";
    post.content = content;
    if (req.file) {
      await deleteFile(post.img);
      post.img = req.file.path.replace(/\\/g, "/");
    }
    const updatedPost = await post.save();
    res.status(200).json({ success: true, message: "Success update the post" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    //validation
    if (!req.isAuth || !res.userId) errTemp("Not Authorized", 403);
    const post = await Post.findById(postId);
    const user = await User.findById(req.userId);
    if (!user || !post) errTemp("User or Post is not found", 404);

    user.posts.pull(postId);
    await user.save();
    await deleteFile(post.img);
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ success: true, message: "Success delete post" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

//add likes (delete and create) and comments function(delete and create) both in post and comments
