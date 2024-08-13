const User = require("../models/User");
const { errTemp } = require("../utils/error");

//show user profile

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
