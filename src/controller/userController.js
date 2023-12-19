const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailController");
const crypto = require("crypto");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const createUser = asyncHandler(async (req, res) => {
  const findEmail = await User.findOne({ Email: req.body.Email });
  if (!findEmail) {
    const newUser = await User.create({
      ...req.body,
      Role: "user",
    });
    res.json(newUser);
  } else {
    throw new Error(`User Already Exists`);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  const user = await User.findOne({ Email });
  const isPasswordMatched = await user?.isPasswordMatched(Password);
  if (user && isPasswordMatched) {
    const id = user._id;
    const refreshToken = generateRefreshToken(id);
    const updatedRefreshTokenUser = await User.findByIdAndUpdate(
      id,
      {
        RefreshToken: refreshToken,
      },
      { new: true }
    );
    const aDayByMilisecond = 24 * 60 * 60 * 1000;
    const dayExpired = 3;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: dayExpired * aDayByMilisecond,
    });
    res.json({
      ...user._doc,
      token: generateToken(id),
    });
  } else {
    throw new Error(`Invalid Credentials`);
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  if (!refreshToken) throw new Error(`No Refresh Token in Cookies.`);
  const user = await User.findOne({ RefreshToken: refreshToken });
  if (!user) throw new Error(`The Refresh Token is not found.`);
  jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded) => {
    if (error || user._id != decoded.id)
      throw new Error(`There is something wrong with refresh token.`);
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  if (!refreshToken) throw new Error(`No Refresh Token in Cookies.`);
  const user = await User.findOne({ RefreshToken: refreshToken });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  if (!user) {
    res.sendStatus(204);
  }
  user.RefreshToken = "";
  await user.save();
  return res.sendStatus(204);
});

const getAllUser = asyncHandler(async (req, res) => {
  const allUsers = await User.find();
  res.json(allUsers);
});

const getOneUser = asyncHandler(async (req, res) => {
  let id = validateMongoId(req.params.id);
  const user = await User.findById(id);
  res.json({ user });
});

const removeOneUser = asyncHandler(async (req, res) => {
  let id = validateMongoId(req.params.id);
  const removedUser = await User.findByIdAndDelete(id);
  res.json({ removedUser });
});

const updateUser = asyncHandler(async (req, res) => {
  let id = validateMongoId(req.params?.id || req.user._id);
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ updatedUser });
});

const blockUser = asyncHandler(async (req, res) => {
  let id = validateMongoId(req.params.id);
  const blockedUser = await User.findByIdAndUpdate(
    id,
    { IsBlocked: true },
    { new: true }
  );
  res.json(`User is blocked.`);
});

const unblockUser = asyncHandler(async (req, res) => {
  let id = validateMongoId(req.params.id);
  const unblockedUser = await User.findByIdAndUpdate(
    id,
    { IsBlocked: false },
    { new: true }
  );
  res.json(`User is unblocked.`);
});

const updatePassword = asyncHandler(async (req, res) => {
  const password = req.body?.Password;
  const user = await User.findById(req.user._id);
  if (password) {
    user.Password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ Email: email });
  if (!user) throw new Error("User not found with this email");
  const token = await user.createPasswordResetToken();
  await user.save();
  const randomPassword = Math.random().toString(36).slice(-8);
  const resetURL = `Hi ${user.FullName}, Your new password is ${randomPassword}.
  <br>Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}/${randomPassword}">Click Here</a>`;
  const data = {
    to: email,
    text: "Hey " + user.FullName,
    subject: "Forgot Password Link",
    html: resetURL,
  };
  sendEmail(data);
  res.json(token);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    PasswordResetToken: hashedToken,
    PasswordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(`Token expired. Please try again later.`);
  user.Password = password;
  user.PasswordResetToken = undefined;
  user.PasswordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).populate("WishList");
  const wishlist = user.WishList;
  res.json({ wishlist });
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getOneUser,
  removeOneUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishlist,
};
