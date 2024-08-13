const User = require("../models/User");
const { errTemp } = require("../utils/error");

//show user profile
//search followers and following
exports.showUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "-password")?.populate(
      "posts",
      "img"
    );
    if (!user) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get user profile", user });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.showFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "-password")?.populate(
      "followers",
      "name _id"
    );
    if (!user) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get followers user" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.showFollowed = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "-password")?.populate(
      "followed",
      "name _id"
    );
    if (!user) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get followed user" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const searchTerm = req.params.searchTerm;
    const users = await User.find(
      {
        $or: [
          {
            email: { $regex: searchTerm, $options: "i" },
          },
          {
            name: { $regex: searchTerm, $options: "i" },
          },
          {
            bio: { $regex: searchTerm, $options: "i" },
          },
        ],
      },
      "-password"
    );
    if (!users) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get users", users });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateBio = async (req, res, next) => {
  try {
    if (!req.isAuth || req.userId) errTemp("Not Authorized", 403);
    const user = await User.findById(req.userId);
    if (!user) errTemp("User not found", 404);

    const newBio = req.body.bio || "";
    user.bio = newBio;
    await user.save();
    res.status(200).json({ success: true, message: "Success update bio" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.addFollowing = async (req, res, next) => {
  try {
    //validation
    if (!req.isAuth || !req.userId) errTemp("Not Authorized", 403);
    const followedUserId = req.params.userId;
    const currentUser = await User.findById(req.userId);
    const followedUser = await User.findById(followedUserId);
    if (!currentUser || !followedUser) errTemp("User not found", 404);

    //current user
    currentUser.followed.push(followedUser);

    //followed user
    followedUser.followers.push(currentUser);

    await currentUser.save();
    await followedUser.save();
    res
      .status(200)
      .json({ success: true, message: "Success add followers and followed" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.removeFollowing = async (req, res, next) => {
  try {
    //validation
    if (!req.isAuth || !req.userId) errTemp("Not Authorized", 403);
    const followedUserId = req.params.userId;
    const currentUser = await User.findById(req.userId);
    const followedUser = await User.findById(followedUserId);
    if (!currentUser || !followedUser) errTemp("User not found", 404);

    currentUser.followed.pull(followedUser);
    followedUser.followers.pull(currentUser);
    await currentUser.save();
    await followedUser.save();
    res.status(200).json({
      success: true,
      message: "Success remove the followers and followed",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
