const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");

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
  const findUser = await User.findOne({ Email });
  const isPasswordMatched = await findUser.isPasswordMatched(Password);
  if (findUser && isPasswordMatched) {
    res.json({
      ...findUser._doc,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error(`Invalid Credentials`);
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const getOneUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(validateMongoId(req.params.id));
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

const removeOneUser = asyncHandler(async (req, res) => {
  try {
    const removedUser = await User.findByIdAndDelete(
      validateMongoId(req.params.id)
    );
    res.json({ removedUser });
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    let id = req.params?.id || req.user._id;
    id = validateMongoId(id);
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ updatedUser });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  try {
    const blockedUser = await User.findByIdAndUpdate(
      validateMongoId(req.params.id),
      { IsBlocked: true },
      { new: true }
    );
    res.json(`User is blocked.`);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  try {
    const unblockedUser = await User.findByIdAndUpdate(
      validateMongoId(req.params.id),
      { IsBlocked: false },
      { new: true }
    );
    res.json(`User is unblocked.`);
  } catch (error) {
    throw new Error(error);
  }
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
};
