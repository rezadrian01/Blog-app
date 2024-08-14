const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { config } = require("dotenv");
const { validationResult } = require("express-validator");

const User = require("../models/User");

const { errTemp } = require("../utils/error");

config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_DOMAIN}/auth/google/callback`
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

exports.googleAuth = async (req, res, next) => {
  return res.redirect(authorizationUrl);
};

exports.googleAuthCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });
    const { data } = await oauth2.userinfo.get();
    const existingUser = await User.findOne({ email: data.email });
    data.name = data.name.replace(/\s+/g, "");
    let jwtToken;
    if (!existingUser) {
      const newUser = new User({
        email: data.email,
        name: data.name,
      });
      const createdUser = await newUser.save();
      jwtToken = jwt.sign(
        {
          userId: createdUser._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRY }
      );
    } else {
      if (data.name !== existingUser.name) data.name = existingUser.name;
      jwtToken = jwt.sign(
        {
          userId: existingUser._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRY }
      );
    }
    return res.redirect(
      `${process.env.CLIENT_DOMAIN}/auth/google/callback?token=${jwtToken}&username=${data.name}`
    );
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      errTemp("Validation failed", 422, errors.array());
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name.replace(/\s+/g, "");
    console.log(email, password, name);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errTemp("Email has been taken", 401);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    const createdUser = await newUser.save();
    res.status(201).json({
      message: "Success create user",
      userId: createdUser._id,
      success: true,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      errTemp("Validation failed", 422, errors.array());
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) errTemp("User not found", 404);
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) errTemp("Wrong password", 422);
    const jwtToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    res.status(200).json({
      message: "Login successfully",
      token: jwtToken,
      name: user.name,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
