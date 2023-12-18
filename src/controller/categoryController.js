const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const Category = require("../models/categoryModel");

const createCategory = asyncHandler(async (req, res) => {
  const newCategory = await Category.create(req.body);
  res.json({ newCategory });
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ updatedCategory });
});

const removeCategory = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const removedCategory = await Category.findByIdAndDelete(id);
  res.json({ removedCategory });
});

const getCategory = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const category = await Category.findById(id);
  res.json({ category });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({Type: req.params.type});
  res.json({ categories });
});

module.exports = {
  createCategory,
  updateCategory,
  removeCategory,
  getCategory,
  getAllCategories,
};
