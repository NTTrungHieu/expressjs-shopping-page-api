const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const Color = require("../models/colorModel");

const createColor = asyncHandler(async (req, res) => {
  const newColor = await Color.create(req.body);
  res.json({ newColor });
});

const updateColor = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ updatedColor });
});

const removeColor = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const removedColor = await Color.findByIdAndDelete(id);
  res.json({ removedColor });
});

const getColor = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const Color = await Color.findById(id);
  res.json({ Color });
});

const getAllColors = asyncHandler(async (req, res) => {
  const Colors = await Color.find();
  res.json({ Colors });
});

module.exports = {
  createColor,
  updateColor,
  removeColor,
  getColor,
  getAllColors,
};
