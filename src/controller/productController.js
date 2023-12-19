const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { validateMongoId } = require("../utils/validate");
const User = require("../models/userModel");
const cloudinaryUploadImage = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  if (req.body?.Title) {
    req.body.Slug = slugify(req.body.Title);
  }
  const product = await Product.create(req.body);
  res.json({ product });
});

const updateProduct = asyncHandler(async (req, res) => {
  if (req.body?.Title) {
    req.body.Slug = slugify(req.body.Title);
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedProduct);
});

const removeProduct = asyncHandler(async (req, res) => {
  const removedProduct = await Product.findByIdAndDelete(req.params.id);
  res.json(removedProduct);
});

const getOneProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ product });
});

const getAllProduct = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((e) => delete queryObj[e]);
  const query = Product.find(queryObj);

  // sorting
  let sortStr = req.query?.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";
  query.sort(sortStr);

  // limiting the fields
  let fields = req.query?.fields
    ? req.query.fields.split(",").join(" ")
    : "-__v";
  query.select(fields);

  // pagination
  let limitedNumber = req.query?.limit || 10;
  let pageNumber = req.query?.page - 1 || 0;
  let skipNumber = pageNumber * limitedNumber;
  query.skip(skipNumber).limit(limitedNumber);

  const products = await query;
  res.json({ products });
});

const addToWishList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = validateMongoId(req.params.id);
  const product = await Product.findById(productId);
  const user = await User.findById(userId);
  if (product && user) {
    let isAdded = await user.WishList.find(
      (id) => id.toString() === productId.toString()
    );
    if (isAdded) {
      isAdded = false;
      await user.WishList.pull(productId);
    } else {
      isAdded = true;
      await user.WishList.push(productId);
    }
    await user.save();
    res.json({ ...user._doc, WishlistIncluded: isAdded });
  } else {
    throw new Error(`There's no product or user with this ID`);
  }
});

const rateProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { star, comment } = req.body;
  const productId = validateMongoId(req.params.id);
  const product = await Product.findById(productId);
  if (product) {
    let isRated = await product.Ratings.find(
      (rating) => rating.PostedBy.toString() === userId.toString()
    );
    if (isRated) {
      isRated.Star = star;
      isRated.Comment = comment;
      // await isRated.save();
    } else {
      await product.Ratings.push({
        Star: star,
        PostedBy: userId,
        Comment: comment,
      });
    }
    const sumRating = product.Ratings.reduce(
      (total, cur) => total + cur.Star,
      0
    );
    const totalRating = product.Ratings.length;
    const averageRating = Math.round((sumRating * 100) / totalRating) / 100;
    product.AverageRating = averageRating;
    product.save();
    isRated = true;
    res.json({ ...product._doc, IsRated: isRated, Star: star });
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const id = validateMongoId(req.params.id);
  const urls = [];
  for (const file of req.files) {
    const newPath = await cloudinaryUploadImage(file.path, "images");
    urls.push(newPath);
    fs.unlinkSync(file.path);
  }
  const product = await Product.findById(id);
  product.Images.push(...urls);
  await product.save();
  return res.json(product);
});

module.exports = {
  createProduct,
  getOneProduct,
  getAllProduct,
  updateProduct,
  removeProduct,
  addToWishList,
  rateProduct,
  uploadImages
};
