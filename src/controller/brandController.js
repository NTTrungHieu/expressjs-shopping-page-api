const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils/validate");
const Brand = require("../models/brandModel");

const createBrand = asyncHandler(async (req, res) => {
  const newBrand = await Brand.create(req.body);
  res.json({ newBrand });
});

const updateBrand = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ updatedBrand });
});

const removeBrand = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const removedBrand = await Brand.findByIdAndDelete(id);
  res.json({ removedBrand });
});

const getBrand = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const brand = await Brand.findById(id);
  res.json({ brand });
});

const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({ brands });
});

module.exports = {
  createBrand,
  updateBrand,
  removeBrand,
  getBrand,
  getAllBrands,
};
