const { generateToken, generateRefreshToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const jwt = require("jsonwebtoken")

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
  jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded)=>{
    if(error || user._id != decoded.id) throw new Error(`There is something wrong with refresh token.`);
    const accessToken = generateToken(user._id);
    res.json({accessToken});
  })
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  if (!refreshToken) throw new Error(`No Refresh Token in Cookies.`);
  const user = await User.findOne({ RefreshToken: refreshToken });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true
  })
  if (!user){
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
  const user = await User.findById(validateMongoId(req.params.id));
  res.json({ user });
});

const removeOneUser = asyncHandler(async (req, res) => {
  const removedUser = await User.findByIdAndDelete(
    validateMongoId(req.params.id)
  );
  res.json({ removedUser });
});

const updateUser = asyncHandler(async (req, res) => {
  let id = req.params?.id || req.user._id;
  id = validateMongoId(id);
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ updatedUser });
});

const blockUser = asyncHandler(async (req, res) => {
  const blockedUser = await User.findByIdAndUpdate(
    validateMongoId(req.params.id),
    { IsBlocked: true },
    { new: true }
  );
  res.json(`User is blocked.`);
});

const unblockUser = asyncHandler(async (req, res) => {
  const unblockedUser = await User.findByIdAndUpdate(
    validateMongoId(req.params.id),
    { IsBlocked: false },
    { new: true }
  );
  res.json(`User is unblocked.`);
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
  logout
};
