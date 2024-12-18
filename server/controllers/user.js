const User = require("../models/User");
const { errTemp } = require("../utils/error");
const { deleteFile } = require("../utils/file");

//show user profile
//search followers and following
//update profile not just bio
//create forgot password functionality
exports.showUserProfile = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ name: username }, "-password")
      .populate("posts", "img")
      .populate("followers", "name _id imgProfile")
      .populate("followed", "name _id imgProfile")
      .populate("posts", "img");
    if (!user) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get user profile", user });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.showUserImgProfile = async (req, res, next) => {
  try {
    const name = req.params.username;
    const user = await User.findOne({ name }).select("imgProfile");
    if (!user) errTemp("User not found", 404);
    res.status(200).json({
      success: true,
      message: "Success get image user profile",
      img: user.imgProfile,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.showFollowers = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ name: username }, "-password")
      .select("followers")
      .populate("followers", "name _id");
    if (!user) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get followers user", user });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.showFollowed = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ name: username }, "-password")
      .select("followed")
      .populate("followed", "name _id");
    if (!user) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get followed user", user });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const searchTerm = req.params.searchTerm;
    const users = await User.find({
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
    }).select("name _id imgProfile bio");
    if (!users) errTemp("User not found", 404);
    res
      .status(200)
      .json({ success: true, message: "Success get users", users });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    if (!req.isAuth || !req.userId) errTemp("Not Authorized", 403);
    const user = await User.findById(req.userId);
    if (!user) errTemp("User not found", 404);

    const newBio = req.body.bio || "";
    const newName = req.body.name || user.name;
    //add email
    if (req.body.newPassword && req.body.newPassword !== "") {
      const oldPassword = req.body.oldPassword;
      const oldPasswordIsCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!oldPasswordIsCorrect) {
        errTemp("Wrong Password", 422);
      }
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
      user.password = hashedPassword;
    }
    if (req.file) {
      deleteFile(user.imgProfile);
      user.imgProfile = req.file.path.replace(/\\/g, "/");
    }
    user.bio = newBio;
    user.name = newName;
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      message: "Success update bio",
      username: updatedUser.name,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.addFollowing = async (req, res, next) => {
  try {
    //validation
    if (!req.isAuth || !req.userId) errTemp("Not Authorized", 403);
    const followedUsername = req.params.username;
    const currentUser = await User.findById(req.userId);
    const followedUser = await User.findOne({ name: followedUsername });
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
    const followedUsername = req.params.username;
    const currentUser = await User.findById(req.userId);
    const followedUser = await User.findOne({ name: followedUsername });
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
